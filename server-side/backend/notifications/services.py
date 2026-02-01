from decimal import Decimal
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification, NotificationPreference, PriceAlert


class NotificationService:
    """Service for creating and sending notifications"""

    @staticmethod
    def get_or_create_preferences(user):
        """Get or create notification preferences for a user"""
        preferences, created = NotificationPreference.objects.get_or_create(
            user=user,
            defaults={
                'in_app_enabled': True,
                'email_enabled': True,
            }
        )
        return preferences

    @staticmethod
    def check_user_preferences(user, notification_type='price_drop'):
        """Check if user wants to receive this type of notification"""
        preferences = NotificationService.get_or_create_preferences(user)
        
        if notification_type == 'price_drop':
            # For price drops, check both in-app and email preferences
            return {
                'in_app': preferences.in_app_enabled,
                'email': preferences.email_enabled,
            }
        return {
            'in_app': preferences.in_app_enabled,
            'email': preferences.email_enabled,
        }

    @staticmethod
    def create_price_drop_notification(user, product_id, product_name, old_price, new_price, currency='TND', vendor=None):
        """Create a price drop notification"""
        price_drop = old_price - new_price
        price_drop_percent = ((price_drop / old_price) * 100) if old_price > 0 else 0
        
        # Check user preferences
        prefs = NotificationService.check_user_preferences(user, 'price_drop')
        
        # Check price drop threshold
        preferences = NotificationService.get_or_create_preferences(user)
        if preferences.price_drop_threshold:
            if price_drop_percent < float(preferences.price_drop_threshold):
                return None  # Price drop is below threshold
        
        title = f"Price Drop Alert: {product_name}"
        message = f"The price of {product_name} has dropped from {old_price:.2f} {currency} to {new_price:.2f} {currency}. Save {price_drop:.2f} {currency} ({price_drop_percent:.1f}% off)!"
        
        if vendor:
            message += f" Available at {vendor}."
        
        # Create notification record
        notification = Notification.objects.create(
            user=user,
            type='price_drop',
            title=title,
            message=message,
            data={
                'product_id': product_id,
                'product_name': product_name,
                'old_price': str(old_price),
                'new_price': str(new_price),
                'currency': currency,
                'price_drop': str(price_drop),
                'price_drop_percent': str(price_drop_percent),
                'vendor': vendor,
            }
        )
        
        # Send in-app notification if enabled
        if prefs['in_app']:
            NotificationService.send_in_app_notification(user, notification)
        
        # Send email notification if enabled
        if prefs['email']:
            NotificationService.send_email_notification(user, notification)
        
        return notification

    @staticmethod
    def send_in_app_notification(user, notification):
        """Send notification via WebSocket"""
        try:
            channel_layer = get_channel_layer()
            if channel_layer:
                async_to_sync(channel_layer.group_send)(
                    f"user_{user.id}",
                    {
                        "type": "notification_message",
                        "notification": {
                            "id": notification.id,
                            "type": notification.type,
                            "title": notification.title,
                            "message": notification.message,
                            "data": notification.data,
                            "read": notification.read,
                            "created_at": notification.created_at.isoformat(),
                        }
                    }
                )
        except Exception as e:
            # Log error but don't fail notification creation
            print(f"Error sending in-app notification: {e}")

    @staticmethod
    def send_email_notification(user, notification):
        """Send notification via email"""
        try:
            if notification.type == 'price_drop':
                context = {
                    'user': user,
                    'notification': notification,
                    'product_name': notification.data.get('product_name', 'Product'),
                    'old_price': notification.data.get('old_price', '0'),
                    'new_price': notification.data.get('new_price', '0'),
                    'currency': notification.data.get('currency', 'TND'),
                    'price_drop': notification.data.get('price_drop', '0'),
                    'price_drop_percent': notification.data.get('price_drop_percent', '0'),
                    'vendor': notification.data.get('vendor'),
                    'product_id': notification.data.get('product_id'),
                    'site_url': getattr(settings, 'FRONTEND_URL', 'http://localhost:6080'),
                }
                
                html_message = render_to_string('notifications/emails/price_drop.html', context)
                plain_message = notification.message
                
                send_mail(
                    subject=notification.title,
                    message=plain_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    html_message=html_message,
                    fail_silently=False,
                )
        except Exception as e:
            # Log error but don't fail notification creation
            print(f"Error sending email notification: {e}")

    @staticmethod
    def get_unread_count(user):
        """Get count of unread notifications for a user"""
        return Notification.objects.filter(user=user, read=False).count()

    @staticmethod
    def mark_as_read(user, notification_id):
        """Mark a notification as read"""
        try:
            notification = Notification.objects.get(id=notification_id, user=user)
            notification.read = True
            notification.save()
            return notification
        except Notification.DoesNotExist:
            return None

    @staticmethod
    def mark_all_as_read(user):
        """Mark all notifications as read for a user"""
        return Notification.objects.filter(user=user, read=False).update(read=True)
