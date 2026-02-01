import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/store/notifications/notificationSlice";
import { useNavigate } from "react-router-dom";
import { useMarkNotificationReadMutation } from "@/store/notifications/notificationApiSlice";
import { useDispatch } from "react-redux";
import { markRead } from "@/store/notifications/notificationSlice";

interface NotificationToastProps {
  notification: Notification;
}

export function NotificationToast({ notification }: NotificationToastProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [markAsRead] = useMarkNotificationReadMutation();

  useEffect(() => {
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
    };

    toast({
      title: notification.title,
      description: notification.message,
      duration: 5000,
      onClick: handleClick,
    });
  }, [notification, toast, navigate, markAsRead, dispatch]);

  return null;
}
