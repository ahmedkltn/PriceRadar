from django.urls import path
from .admin_views import (
    AdminDashboardView,
    AdminUsersListView,
    AdminUserDetailView,
    AdminDatabaseStatsView,
)

app_name = 'admin_api'

urlpatterns = [
    path('dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('users/', AdminUsersListView.as_view(), name='admin_users_list'),
    path('users/<int:user_id>/', AdminUserDetailView.as_view(), name='admin_user_detail'),
    path('database/stats/', AdminDatabaseStatsView.as_view(), name='admin_database_stats'),
]
