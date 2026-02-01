import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  created_at: string;
}

export interface NotificationPreferences {
  in_app_enabled: boolean;
  email_enabled: boolean;
  price_drop_threshold: number | null;
  created_at?: string;
  updated_at?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  isLoading: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  preferences: null,
  isLoading: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      // Add to beginning of array if not already present
      const exists = state.notifications.some((n) => n.id === action.payload.id);
      if (!exists) {
        state.notifications.unshift(action.payload);
        if (!action.payload.read) {
          state.unreadCount += 1;
        }
      }
    },
    markRead: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    setPreferences: (state, action: PayloadAction<NotificationPreferences>) => {
      state.preferences = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  markRead,
  markAllRead,
  setNotifications,
  setUnreadCount,
  setPreferences,
  setLoading,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
