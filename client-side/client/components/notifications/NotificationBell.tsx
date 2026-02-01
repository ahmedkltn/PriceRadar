import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./NotificationItem";
import { useGetNotificationsQuery, useGetStatsQuery } from "@/store/notifications/notificationApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { addNotification, setUnreadCount, Notification as NotificationType } from "@/store/notifications/notificationSlice";
import { getNotificationWebSocket } from "@/lib/websocket";
import { isAuthenticated } from "@/lib/auth";
import { RootState } from "@/store";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const wsRef = useRef<ReturnType<typeof getNotificationWebSocket> | null>(null);
  const { unreadCount } = useSelector((state: RootState) => state.notifications);

  // Fetch notifications and stats
  const { data: notificationsData, refetch: refetchNotifications } = useGetNotificationsQuery(
    { page: 1, page_size: 10 },
    { skip: !isAuthenticated() }
  );
  const { data: stats, refetch: refetchStats } = useGetStatsQuery(undefined, {
    skip: !isAuthenticated(),
  });

  // Update unread count from stats
  useEffect(() => {
    if (stats) {
      dispatch(setUnreadCount(stats.unread_count));
    }
  }, [stats, dispatch]);

  // Setup WebSocket connection
  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    const ws = getNotificationWebSocket();
    wsRef.current = ws;

    ws.connect({
      onNotification: (notification) => {
        if (notification) {
          dispatch(addNotification(notification as NotificationType));
          dispatch(setUnreadCount((prev) => prev + 1));
        }
      },
      onUnreadCount: (count) => {
        dispatch(setUnreadCount(count));
      },
      onConnection: (count) => {
        dispatch(setUnreadCount(count));
        refetchStats();
      },
      onError: (error) => {
        console.error("WebSocket error:", error);
      },
      onClose: () => {
        console.log("WebSocket closed");
      },
    });

    return () => {
      ws.disconnect();
    };
  }, [dispatch, refetchStats]);

  // Refetch when dropdown opens
  useEffect(() => {
    if (isOpen) {
      refetchNotifications();
      refetchStats();
    }
  }, [isOpen, refetchNotifications, refetchStats]);

  const notifications = notificationsData?.results || [];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClose={() => setIsOpen(false)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <div className="p-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                // Navigate to full notifications page if needed
                setIsOpen(false);
              }}
            >
              View All Notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
