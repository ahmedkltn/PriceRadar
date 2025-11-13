from django.db import models


class CoreOffers(models.Model):
    offer_id = models.TextField(blank=True, null=True)
    vendor = models.TextField(blank=True, null=True)
    url = models.TextField(blank=True, null=True)
    product_name_clean = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'core_offers'


class CorePrices(models.Model):
    field_synthetic_field = models.TextField(db_column='__synthetic__', blank=True, null=True)  
    offer_id = models.TextField(blank=True, null=True)
    price_value = models.DecimalField(max_digits=18, decimal_places=2, blank=True, null=True)
    currency = models.TextField(blank=True, null=True)
    observed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'core_prices'


class VLastestOfferPrices(models.Model):
    offer_id = models.TextField(blank=True, null=True)
    price_value = models.DecimalField(max_digits=18, decimal_places=2, blank=True, null=True)
    currency = models.TextField(blank=True, null=True)
    observed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'v_lastest_offer_prices'
