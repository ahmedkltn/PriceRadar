from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from .models import SavedProduct

User = get_user_model()

# Unregister default User admin and register with custom configuration
# This allows us to customize the User admin if needed
if admin.site.is_registered(User):
    admin.site.unregister(User)

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model"""
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')


@admin.register(SavedProduct)
class SavedProductAdmin(admin.ModelAdmin):
    """Admin configuration for SavedProduct model"""
    list_display = ('user', 'product_id', 'saved_at')
    list_filter = ('saved_at',)
    search_fields = ('user__username', 'user__email', 'product_id')
    readonly_fields = ('saved_at',)
    date_hierarchy = 'saved_at'
