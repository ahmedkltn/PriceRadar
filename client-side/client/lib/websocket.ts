import { getAccessToken } from "./auth";

export type NotificationMessage = {
  type: string;
  notification?: {
    id: number;
    type: string;
    title: string;
    message: string;
    data: Record<string, any>;
    read: boolean;
    created_at: string;
  };
  unread_count?: number;
  count?: number;
  notification_id?: number;
};

type WebSocketCallbacks = {
  onNotification?: (notification: NotificationMessage['notification']) => void;
  onUnreadCount?: (count: number) => void;
  onConnection?: (unreadCount: number) => void;
  onError?: (error: Event) => void;
  onClose?: () => void;
};

class NotificationWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; // 3 seconds
  private reconnectTimer: NodeJS.Timeout | null = null;
  private callbacks: WebSocketCallbacks = {};
  private isConnecting = false;
  private shouldReconnect = true;

  constructor(private wsUrl: string) {}

  connect(callbacks: WebSocketCallbacks = {}) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.callbacks = callbacks;
    this.shouldReconnect = true;
    this.isConnecting = true;

    const token = getAccessToken();
    if (!token) {
      console.warn("No access token available for WebSocket connection");
      this.isConnecting = false;
      return;
    }

    // Build WebSocket URL with token
    const url = `${this.wsUrl}?token=${encodeURIComponent(token)}`;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.isConnecting = false;
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const message: NotificationMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
        if (this.callbacks.onError) {
          this.callbacks.onError(error);
        }
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.isConnecting = false;
        this.ws = null;

        if (this.callbacks.onClose) {
          this.callbacks.onClose();
        }

        // Attempt to reconnect if needed
        if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
      this.isConnecting = false;
      if (this.callbacks.onError) {
        this.callbacks.onError(error as Event);
      }
    }
  }

  private handleMessage(message: NotificationMessage) {
    switch (message.type) {
      case "notification":
        if (message.notification && this.callbacks.onNotification) {
          this.callbacks.onNotification(message.notification);
        }
        break;

      case "connection":
        if (message.unread_count !== undefined && this.callbacks.onConnection) {
          this.callbacks.onConnection(message.unread_count);
        }
        break;

      case "unread_count":
        if (message.count !== undefined && this.callbacks.onUnreadCount) {
          this.callbacks.onUnreadCount(message.count);
        }
        break;

      case "mark_read_success":
        // Notification marked as read, could trigger a refresh
        break;

      default:
        console.log("Unknown message type:", message.type);
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;

    console.log(`Scheduling WebSocket reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect(this.callbacks);
      }
    }, delay);
  }

  disconnect() {
    this.shouldReconnect = false;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(message: Record<string, any>) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected. Cannot send message.");
    }
  }

  markAsRead(notificationId: number) {
    this.send({
      type: "mark_read",
      notification_id: notificationId,
    });
  }

  getUnreadCount() {
    this.send({
      type: "get_unread_count",
    });
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Get WebSocket URL from environment or use default
const getWebSocketUrl = (): string => {
  // Determine if we should use ws or wss
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  
  // In development, Vite proxy handles WebSocket connections
  // Use the same origin with /ws path which will be proxied to backend
  const host = window.location.host;
  return `${protocol}//${host}/ws/notifications/`;
};

// Create singleton instance
let wsInstance: NotificationWebSocket | null = null;

export const getNotificationWebSocket = (): NotificationWebSocket => {
  if (!wsInstance) {
    wsInstance = new NotificationWebSocket(getWebSocketUrl());
  }
  return wsInstance;
};

export const disconnectNotificationWebSocket = () => {
  if (wsInstance) {
    wsInstance.disconnect();
    wsInstance = null;
  }
};
