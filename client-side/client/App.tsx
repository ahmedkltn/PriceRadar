import "./global.css";
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import AboutPage from "./pages/AboutPage";
import ContactUsPage from "./pages/ContactUsPage";
import SignInPage from "./pages/SignInPage";
import CheckEmailPage from "./pages/CheckEmailPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import SavedProductsPage from "./pages/SavedProductsPage";
import NotificationPreferencesPage from "./pages/NotificationPreferencesPage";
import UserProfilePage from "./pages/UserProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ScrollToTop from "./lib/ScrollToTop";
import ProductDetailPage from "./pages/ProductDetailPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route
                path="/product/:productId"
                element={<ProductDetailPage />}
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/register" element={<SignInPage isSignUp />} />
              <Route path="/check-email" element={<CheckEmailPage />} />
              <Route path="/verify-email/:uid/:token" element={<VerifyEmailPage />} />
              <Route path="/saved-products" element={<SavedProductsPage />} />
              {/* Account Settings Routes */}
              <Route
                path="/account/profile"
                element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/change-password"
                element={
                  <ProtectedRoute>
                    <ChangePasswordPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationPreferencesPage />
                  </ProtectedRoute>
                }
              />
              {/* Legacy route - redirect to new route */}
              <Route
                path="/notifications/preferences"
                element={<Navigate to="/account/notifications" replace />}
              />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);

createRoot(document.getElementById("root")!).render(<App />);
