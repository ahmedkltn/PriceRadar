from decimal import Decimal
from django.utils import timezone
from django.db.models import OuterRef, Subquery
from pricing.models import DimProduct, OfferProductMap, VLastestOfferPrices, CoreOffers
from accounts.models import SavedProduct
from .models import PriceAlert
from .services import NotificationService


def check_price_changes():
    """
    Check for price changes in saved products and trigger notifications.
    This function should be called periodically (e.g., via Celery or cron).
    """
    # Get all saved products with their users
    saved_products = SavedProduct.objects.select_related('user').all()
    
    notifications_created = 0
    
    for saved_product in saved_products:
        try:
            # Get product
            product = DimProduct.objects.get(product_id=saved_product.product_id)
            
            # Get offers for this product
            mapped_offer_ids = OfferProductMap.objects.filter(
                product_id=product.product_id
            ).values_list("offer_id", flat=True)
            
            if not mapped_offer_ids:
                continue
            
            # Get latest prices for offers
            latest_price_qs = VLastestOfferPrices.objects.filter(
                offer_id=OuterRef("offer_id")
            )
            
            offers_qs = (
                CoreOffers.objects
                .filter(offer_id__in=mapped_offer_ids)
                .annotate(
                    price_value=Subquery(latest_price_qs.values("price_value")[:1]),
                    currency=Subquery(latest_price_qs.values("currency")[:1]),
                )
                .exclude(price_value__isnull=True)
            )
            
            # Get cheapest offer
            cheapest = offers_qs.order_by("price_value").first()
            
            if not cheapest or not cheapest.price_value:
                continue
            
            current_price = Decimal(str(cheapest.price_value))
            currency = cheapest.currency or 'TND'
            vendor = cheapest.vendor
            
            # Get or create price alert
            price_alert, created = PriceAlert.objects.get_or_create(
                user=saved_product.user,
                product_id=saved_product.product_id,
                defaults={
                    'last_notified_price': current_price,
                    'last_checked_at': timezone.now(),
                }
            )
            
            # Check if price has decreased
            if price_alert.last_notified_price and current_price < price_alert.last_notified_price:
                # Price has dropped - create notification
                notification = NotificationService.create_price_drop_notification(
                    user=saved_product.user,
                    product_id=saved_product.product_id,
                    product_name=product.display_name or f"Product {saved_product.product_id}",
                    old_price=price_alert.last_notified_price,
                    new_price=current_price,
                    currency=currency,
                    vendor=vendor,
                )
                
                if notification:
                    notifications_created += 1
                    # Update price alert
                    price_alert.last_notified_price = current_price
                    price_alert.last_checked_at = timezone.now()
                    price_alert.save()
            
            # Update last checked time even if no price change
            elif not created:
                price_alert.last_checked_at = timezone.now()
                price_alert.save()
            
            # If this is the first check, just set the baseline price
            elif created:
                price_alert.last_notified_price = current_price
                price_alert.save()
                
        except DimProduct.DoesNotExist:
            # Product no longer exists, skip
            continue
        except Exception as e:
            # Log error but continue with other products
            print(f"Error checking price for product {saved_product.product_id}: {e}")
            continue
    
    return {
        'checked': saved_products.count(),
        'notifications_created': notifications_created,
    }
