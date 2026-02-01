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
    vendor_category_id = models.TextField(blank=True, null=True)
    vendor_brand_id = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'core_offers'


# Unmanaged model for dim_brand
class DimBrand(models.Model):
    brand_id = models.TextField(primary_key=True)
    brand_name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'dim_brand'


# Unmanaged model for dim_product
class DimProduct(models.Model):
    product_id = models.IntegerField(primary_key=True)
    display_name = models.TextField(blank=True, null=True)
    display_image_url = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "dim_product" 


# Unmanaged model for offer_product_map
class OfferProductMap(models.Model):
    # One offer maps to one canonical product
    offer_id = models.TextField(primary_key=True)
    product_id = models.IntegerField(blank=True, null=True)
    confidence = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'offer_product_map'


class CorePrices(models.Model):
    field_synthetic_field = models.TextField(
        primary_key=True,
        db_column='__synthetic__',
    )
    offer_id = models.TextField(blank=True, null=True, db_index=True)
    price_value = models.DecimalField(max_digits=18, decimal_places=2, blank=True, null=True)
    currency = models.TextField(blank=True, null=True)
    observed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'core_prices'


class VLastestOfferPrices(models.Model):
    offer_id = models.TextField(primary_key=True,blank=True, db_index=True)
    price_value = models.DecimalField(max_digits=18, decimal_places=2, blank=True, null=True)
    currency = models.TextField(blank=True, null=True)
    observed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'v_lastest_offer_prices'
