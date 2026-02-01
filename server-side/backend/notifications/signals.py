from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from accounts.models import SavedProduct
from .models import PriceAlert


@receiver(post_save, sender=SavedProduct)
def create_price_alert_on_save(sender, instance, created, **kwargs):
    """Create PriceAlert when a product is saved"""
    if created:
        # Create price alert for this saved product
        PriceAlert.objects.get_or_create(
            user=instance.user,
            product_id=instance.product_id,
        )


@receiver(post_delete, sender=SavedProduct)
def delete_price_alert_on_unsave(sender, instance, **kwargs):
    """Delete PriceAlert when a product is unsaved"""
    try:
        price_alert = PriceAlert.objects.get(
            user=instance.user,
            product_id=instance.product_id
        )
        price_alert.delete()
    except PriceAlert.DoesNotExist:
        pass
