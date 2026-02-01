from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal

User = get_user_model()


class NotificationPreference(models.Model):
    """User notification preferences and settings"""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='notification_preferences'
    )
    in_app_enabled = models.BooleanField(default=True, help_text="Enable in-app notifications")
    email_enabled = models.BooleanField(default=True, help_text="Enable email notifications")
    price_drop_threshold = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.01')), MaxValueValidator(Decimal('100.00'))],
        help_text="Minimum percentage price drop to trigger notification (e.g., 5.00 for 5%)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'notification_preferences'
        verbose_name = 'Notification Preference'
        verbose_name_plural = 'Notification Preferences'

    def __str__(self):
        return f"Preferences for {self.user.username}"


class Notification(models.Model):
    """Notification records for users"""
    NOTIFICATION_TYPES = [
        ('price_drop', 'Price Drop'),
        ('price_increase', 'Price Increase'),
        ('product_available', 'Product Available'),
        ('system', 'System Notification'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='price_drop')
    title = models.CharField(max_length=200)
    message = models.TextField()
    data = models.JSONField(default=dict, blank=True, help_text="Additional data (product_id, prices, etc.)")
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'read']),
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['read', 'created_at']),
        ]

    def __str__(self):
        return f"{self.title} - {self.user.username} ({'read' if self.read else 'unread'})"


class PriceAlert(models.Model):
    """Track price monitoring for saved products"""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='price_alerts'
    )
    product_id = models.IntegerField()
    last_notified_price = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Last price at which user was notified"
    )
    last_checked_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'price_alerts'
        unique_together = [['user', 'product_id']]
        indexes = [
            models.Index(fields=['user', 'product_id']),
            models.Index(fields=['product_id']),
        ]

    def __str__(self):
        return f"{self.user.username} - Product {self.product_id}"
