// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { productApiSlice } from './products/productApiSlice';
import { authApiSlice } from './auth/authApiSlice';
import { notificationApiSlice } from './notifications/notificationApiSlice';
import { reviewApiSlice } from './reviews/reviewApiSlice';
import authReducer from './auth/authSlice';
import notificationReducer from './notifications/notificationSlice';

export const store = configureStore({
  reducer: {
    [productApiSlice.reducerPath]: productApiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [notificationApiSlice.reducerPath]: notificationApiSlice.reducer,
    [reviewApiSlice.reducerPath]: reviewApiSlice.reducer,
    auth: authReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApiSlice.middleware,
      authApiSlice.middleware,
      notificationApiSlice.middleware,
      reviewApiSlice.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;