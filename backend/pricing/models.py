from django.db import models


class DimVendorCategory(models.Model):
    vendor_category_id = models.TextField(primary_key=True)
    vendor = models.TextField(blank=True, null=True)
    vendor_category_name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'dim_vendor_category'


class DimVendorSubcategory(models.Model):
    vendor_subcategory_id = models.TextField(primary_key=True)
    vendor_category_id = models.TextField(blank=True, null=True)
    vendor = models.TextField(blank=True, null=True)
    vendor_category_name = models.TextField(blank=True, null=True)
    vendor_subcategory_name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'dim_vendor_subcategory'


class CoreOffers(models.Model):
    offer_id = models.TextField(primary_key=True)
    vendor = models.TextField(blank=True, null=True)
    url = models.TextField(blank=True, null=True)
    image_url = models.TextField(blank=True, null=True)
    product_name_clean = models.TextField(blank=True, null=True)
    vendor_subcategory_id = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'core_offers'


class CorePrices(models.Model):
    id = models.AutoField(primary_key=True)   
    field_synthetic_field = models.TextField(
        db_column='__synthetic__',
        blank=True,
        null=True,
    )
    offer_id = models.TextField(blank=True, null=True)
    price_value = models.DecimalField(max_digits=18, decimal_places=2, blank=True, null=True)
    currency = models.TextField(blank=True, null=True)
    observed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'core_prices'


class VLastestOfferPrices(models.Model):
    id = models.AutoField(primary_key=True)  
    offer_id = models.TextField(blank=True, null=True)
    price_value = models.DecimalField(max_digits=18, decimal_places=2, blank=True, null=True)
    currency = models.TextField(blank=True, null=True)
    observed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'v_lastest_offer_prices'
