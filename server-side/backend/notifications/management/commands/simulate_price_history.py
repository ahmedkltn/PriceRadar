from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta
from notifications.services import NotificationService
from notifications.models import PriceAlert
from pricing.models import DimProduct, CorePrices, CoreOffers, OfferProductMap
from accounts.models import SavedProduct

User = get_user_model()


class Command(BaseCommand):
    help = 'Simulate price history by creating multiple price records and triggering notifications'

    def add_arguments(self, parser):
        parser.add_argument(
            '--user',
            type=str,
            help='Username or email to simulate price history for (optional)',
        )
        parser.add_argument(
            '--product-id',
            type=int,
            help='Product ID to simulate price history for (optional)',
        )
        parser.add_argument(
            '--days',
            type=int,
            default=7,
            help='Number of days of price history to simulate (default: 7)',
        )

    def handle(self, *args, **options):
        username_or_email = options.get('user')
        product_id = options.get('product_id')
        days = options.get('days', 7)

        # Get users
        if username_or_email:
            try:
                if '@' in username_or_email:
                    users = [User.objects.get(email=username_or_email)]
                else:
                    users = [User.objects.get(username=username_or_email)]
            except User.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'User "{username_or_email}" not found.')
                )
                return
        else:
            # Get all users with saved products
            users = User.objects.filter(saved_products__isnull=False).distinct()
            if not users.exists():
                self.stdout.write(
                    self.style.WARNING('No users with saved products found.')
                )
                return

        notifications_created = 0

        for user in users:
            self.stdout.write(f'\nProcessing user: {user.username} ({user.email})')
            
            # Get saved products
            if product_id:
                saved_products = SavedProduct.objects.filter(
                    user=user,
                    product_id=product_id
                )
            else:
                saved_products = SavedProduct.objects.filter(user=user)[:3]  # Limit to 3 products
            
            if not saved_products.exists():
                self.stdout.write(
                    self.style.WARNING(f'  No saved products found for {user.username}.')
                )
                continue

            for saved_product in saved_products:
                try:
                    product = DimProduct.objects.get(product_id=saved_product.product_id)
                    self.stdout.write(f'\n  Simulating price history for: {product.display_name or product.product_id}')
                    
                    # Get offers for this product
                    mapped_offer_ids = list(OfferProductMap.objects.filter(
                        product_id=product.product_id
                    ).values_list("offer_id", flat=True))
                    
                    if not mapped_offer_ids:
                        self.stdout.write(
                            self.style.WARNING(f'  ⚠ No offers found for product {product.product_id}')
                        )
                        continue
                    
                    # Use the first offer
                    offer_id = mapped_offer_ids[0]
                    
                    # Get or create price alert
                    price_alert, created = PriceAlert.objects.get_or_create(
                        user=user,
                        product_id=saved_product.product_id,
                    )
                    
                    # Start with a high price - reset to a higher baseline for simulation
                    base_price = Decimal('1500.00')
                    
                    # Temporarily set a higher price to allow multiple drops
                    if price_alert.last_notified_price and price_alert.last_notified_price < base_price:
                        price_alert.last_notified_price = base_price
                        price_alert.save()
                    
                    current_price = price_alert.last_notified_price or base_price
                    
                    # Simulate price drops over the specified days
                    # Each drop is relative to the base price, creating a descending sequence
                    price_drops = [
                        (Decimal('0.95'), '5% drop'),
                        (Decimal('0.90'), '10% drop'),
                        (Decimal('0.85'), '15% drop'),
                        (Decimal('0.80'), '20% drop'),
                        (Decimal('0.75'), '25% drop'),
                    ]
                    
                    # Start from the highest price
                    starting_price = base_price
                    
                    for i, (multiplier, description) in enumerate(price_drops[:days]):
                        new_price = base_price * multiplier
                        
                        # Only create notification if price actually dropped from current
                        if new_price < current_price:
                            # Create price record in CorePrices (if we can)
                            try:
                                # Create a price entry with timestamp
                                observed_at = timezone.now() - timedelta(days=days-i-1)
                                
                                # Note: CorePrices is managed=False, so we can't directly insert
                                # Instead, we'll just create notifications
                                
                                # Create notification
                                notification = NotificationService.create_price_drop_notification(
                                    user=user,
                                    product_id=product.product_id,
                                    product_name=product.display_name or f"Product {product.product_id}",
                                    old_price=current_price,
                                    new_price=new_price,
                                    currency='TND',
                                    vendor='Simulated Vendor',
                                )
                                
                                if notification:
                                    notifications_created += 1
                                    # Update current_price for next iteration
                                    old_current = current_price
                                    current_price = new_price
                                    price_alert.last_notified_price = new_price
                                    price_alert.save()
                                    
                                    self.stdout.write(
                                        self.style.SUCCESS(
                                            f'    ✓ Day {i+1}: {description} - '
                                            f'{old_current} → {new_price} TND'
                                        )
                                    )
                                else:
                                    self.stdout.write(
                                        self.style.WARNING(f'    ⚠ Day {i+1}: Notification not created (threshold)')
                                    )
                            except Exception as e:
                                self.stdout.write(
                                    self.style.ERROR(f'    ✗ Day {i+1}: Error - {e}')
                                )
                        else:
                            self.stdout.write(
                                self.style.WARNING(f'    ⚠ Day {i+1}: Price not lower, skipping')
                            )
                    
                except DimProduct.DoesNotExist:
                    self.stdout.write(
                        self.style.WARNING(f'  ⚠ Product {saved_product.product_id} not found')
                    )
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'  ✗ Error: {e}')
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Created {notifications_created} notification(s) total.'
            )
        )
        self.stdout.write(
            self.style.SUCCESS(
                'Users can now see multiple notifications in the notification bell icon!'
            )
        )
