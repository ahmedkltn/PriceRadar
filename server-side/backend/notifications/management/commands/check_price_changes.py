from django.core.management.base import BaseCommand
from notifications.tasks import check_price_changes


class Command(BaseCommand):
    help = 'Check for price changes in saved products and send notifications'

    def handle(self, *args, **options):
        self.stdout.write('Checking for price changes...')
        result = check_price_changes()
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Checked {result["checked"]} saved products. '
                f'Created {result["notifications_created"]} notifications.'
            )
        )
