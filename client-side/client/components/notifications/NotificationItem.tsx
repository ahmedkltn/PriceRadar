import { Bell, X } from "lucide-react";
import { Notification } from "@/store/notifications/notificationSlice";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useMarkNotificationReadMutation } from "@/store/notifications/notificationApiSlice";
import { useDispatch } from "react-redux";
import { markRead } from "@/store/notifications/notificationSlice";
import { useNavigate } from "react-router-dom";

interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
}

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [markAsRead] = useMarkNotificationReadMutation();

  const handleClick = async () => {
    if (!notification.read) {
      try {
        await markAsRead(notification.id).unwrap();
        dispatch(markRead(notification.id));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    // Navigate to product if it's a price drop notification
    if (notification.type === "price_drop" && notification.data?.product_id) {
      navigate(`/product/${notification.data.product_id}`);
    }

    if (onClose) {
      onClose();
    }
  };

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  return (
    <div
      className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
        !notification.read ? "bg-primary/5" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Bell className="w-5 h-5 text-background" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground mb-1">
                {notification.title}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground mt-2">{timeAgo}</p>
            </div>
            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
