from django.contrib import admin
from .models import Notification, NotificationPreference, PriceAlert


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'type', 'title', 'read', 'created_at']
    list_filter = ['type', 'read', 'created_at']
    search_fields = ['user__username', 'user__email', 'title', 'message']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'in_app_enabled', 'email_enabled', 'price_drop_threshold', 'updated_at']
    list_filter = ['in_app_enabled', 'email_enabled']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(PriceAlert)
class PriceAlertAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'product_id', 'last_notified_price', 'last_checked_at', 'created_at']
    list_filter = ['last_checked_at', 'created_at']
    search_fields = ['user__username', 'user__email', 'product_id']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
