from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    UserProfileView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    ChangePasswordView,
    EmailVerificationView,
    SavedProductsListView,
    SavedProductDetailView,
    ContactView,
)

app_name = 'accounts'

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User profile
    path('me/', UserProfileView.as_view(), name='user_profile'),
    
    # Password management
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password-reset/confirm/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm_url'),
    
    # Email verification
    path('verify-email/', EmailVerificationView.as_view(), name='verify_email'),
    path('verify-email/<str:uidb64>/<str:token>/', EmailVerificationView.as_view(), name='verify_email_url'),
    
    # Saved products
    path('saved-products/', SavedProductsListView.as_view(), name='saved_products_list'),
    path('saved-products/<int:product_id>/', SavedProductDetailView.as_view(), name='saved_product_detail'),
    
    # Contact form
    path('contact/', ContactView.as_view(), name='contact'),
]
