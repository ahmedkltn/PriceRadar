from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from decimal import Decimal
from notifications.services import NotificationService
from notifications.models import PriceAlert
from pricing.models import DimProduct
from accounts.models import SavedProduct

User = get_user_model()


class Command(BaseCommand):
    help = 'Create test notifications for users with saved products'

    def add_arguments(self, parser):
        parser.add_argument(
            '--user',
            type=str,
            help='Username or email to create notifications for (optional)',
        )
        parser.add_argument(
            '--count',
            type=int,
            default=3,
            help='Number of test notifications to create (default: 3)',
        )

    def handle(self, *args, **options):
        username_or_email = options.get('user')
        count = options.get('count', 3)

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
                self.stdout.write('Creating notifications for all users...')
                users = User.objects.filter(is_active=True)[:5]

        notifications_created = 0

        for user in users:
            self.stdout.write(f'\nProcessing user: {user.username} ({user.email})')
            
            # Get saved products for this user
            saved_products = SavedProduct.objects.filter(user=user)
            
            if not saved_products.exists():
                self.stdout.write(
                    self.style.WARNING(f'  No saved products for {user.username}. Creating test notifications anyway...')
                )
                # Create test notifications even without saved products
                for i in range(min(count, 3)):
                    try:
                        # Get a random product
                        product = DimProduct.objects.order_by('?').first()
                        if not product:
                            self.stdout.write(
                                self.style.ERROR('  No products found in database.')
                            )
                            break
                        
                        # Create a test notification with simulated price drop
                        old_price = Decimal('1000.00')
                        new_price = Decimal('850.00')
                        
                        notification = NotificationService.create_price_drop_notification(
                            user=user,
                            product_id=product.product_id,
                            product_name=product.display_name or f"Test Product {product.product_id}",
                            old_price=old_price,
                            new_price=new_price,
                            currency='TND',
                            vendor='Test Vendor',
                        )
                        
                        if notification:
                            notifications_created += 1
                            self.stdout.write(
                                self.style.SUCCESS(f'  ✓ Created notification #{notifications_created}: {notification.title}')
                            )
                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(f'  ✗ Error creating notification: {e}')
                        )
                continue

            # Process saved products
            for saved_product in saved_products[:count]:
                try:
                    product = DimProduct.objects.get(product_id=saved_product.product_id)
                    
                    # Get or create price alert
                    price_alert, created = PriceAlert.objects.get_or_create(
                        user=user,
                        product_id=saved_product.product_id,
                    )
                    
                    # Simulate a price drop by setting a higher last_notified_price
                    if not price_alert.last_notified_price:
                        # Set a baseline price
                        price_alert.last_notified_price = Decimal('1000.00')
                        price_alert.save()
                    
                    # Create a simulated price drop (reduce by 15%)
                    old_price = price_alert.last_notified_price
                    new_price = old_price * Decimal('0.85')  # 15% drop
                    
                    # Create notification
                    notification = NotificationService.create_price_drop_notification(
                        user=user,
                        product_id=product.product_id,
                        product_name=product.display_name or f"Product {product.product_id}",
                        old_price=old_price,
                        new_price=new_price,
                        currency='TND',
                        vendor='Test Vendor',
                    )
                    
                    if notification:
                        notifications_created += 1
                        # Update price alert to reflect the "new" price
                        price_alert.last_notified_price = new_price
                        price_alert.save()
                        
                        self.stdout.write(
                            self.style.SUCCESS(
                                f'  ✓ Created notification for {product.display_name or product.product_id}: '
                                f'{old_price} → {new_price} TND'
                            )
                        )
                    else:
                        self.stdout.write(
                            self.style.WARNING(f'  ⚠ Notification not created (may be below threshold)')
                        )
                        
                except DimProduct.DoesNotExist:
                    self.stdout.write(
                        self.style.WARNING(f'  ⚠ Product {saved_product.product_id} not found, skipping...')
                    )
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'  ✗ Error: {e}')
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Created {notifications_created} test notification(s) total.'
            )
        )
        self.stdout.write(
            self.style.SUCCESS(
                'Users can now see notifications in the notification bell icon!'
            )
        )
