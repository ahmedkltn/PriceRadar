import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessToken } from "@/lib/auth";
import { Notification, NotificationPreferences } from "./notificationSlice";

// Use environment variable or default to relative path
const envNotificationBase = import.meta.env.VITE_NOTIFICATION_API || "/api/notifications/";
const NOTIFICATION_API_BASE_URL = envNotificationBase.endsWith("/")
  ? envNotificationBase
  : `${envNotificationBase}/`;

export interface NotificationListResponse {
  count: number;
  next: number | null;
  previous: number | null;
  results: Notification[];
}

export interface NotificationStatsResponse {
  unread_count: number;
  total_count: number;
}

export interface UpdatePreferencesRequest {
  in_app_enabled?: boolean;
  email_enabled?: boolean;
  price_drop_threshold?: number | null;
}

export const notificationApiSlice = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: NOTIFICATION_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = getAccessToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Notification", "NotificationPreferences", "NotificationStats"],
  endpoints: (builder) => ({
    // Get notifications list
    getNotifications: builder.query<NotificationListResponse, { page?: number; page_size?: number }>({
      query: ({ page = 1, page_size = 20 }) => ({
        url: "",
        params: { page, page_size },
      }),
      providesTags: ["Notification"],
    }),

    // Mark notification as read
    markNotificationRead: builder.mutation<Notification, number>({
      query: (notificationId) => ({
        url: `${notificationId}/read/`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification", "NotificationStats"],
    }),

    // Mark all notifications as read
    markAllRead: builder.mutation<{ message: string; count: number }, void>({
      query: () => ({
        url: "mark-all-read/",
        method: "POST",
      }),
      invalidatesTags: ["Notification", "NotificationStats"],
    }),

    // Get notification preferences
    getPreferences: builder.query<NotificationPreferences, void>({
      query: () => "preferences/",
      providesTags: ["NotificationPreferences"],
    }),

    // Update notification preferences
    updatePreferences: builder.mutation<NotificationPreferences, UpdatePreferencesRequest>({
      query: (data) => ({
        url: "preferences/",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["NotificationPreferences"],
    }),

    // Get notification statistics
    getStats: builder.query<NotificationStatsResponse, void>({
      query: () => "stats/",
      providesTags: ["NotificationStats"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllReadMutation,
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
  useGetStatsQuery,
} = notificationApiSlice;
