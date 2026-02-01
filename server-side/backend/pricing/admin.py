from django.contrib import admin
from django.core.exceptions import ImproperlyConfigured
from django.http import HttpResponse
from django.template.response import TemplateResponse
from django.utils.html import format_html
from .models import (
    CoreOffers,
    CorePrices,
    VLastestOfferPrices,
    DimProduct,
    DimVendorCategory,
    DimVendorSubcategory,
    DimBrand,
    OfferProductMap,
)
from .admin_utils import table_exists, get_table_schema


class BasePricingAdmin(admin.ModelAdmin):
    """Base admin class with table existence checking"""
    
    def get_queryset(self, request):
        """Override to check if table exists before querying"""
        if not self._table_exists():
            return self.model.objects.none()
        return super().get_queryset(request)
    
    def changelist_view(self, request, extra_context=None):
        """Override to show friendly message if table doesn't exist"""
        if not self._table_exists():
            context = {
                **self.admin_site.each_context(request),
                'title': f'{self.model._meta.verbose_name_plural} - Table Not Found',
                'opts': self.model._meta,
                'has_add_permission': self.has_add_permission(request),
                'table_name': self.model._meta.db_table,
                'cl': {'result_count': 0, 'result_list': []},
            }
            return TemplateResponse(
                request,
                'admin/pricing/table_not_found.html',
                context
            )
        return super().changelist_view(request, extra_context)
    
    def _table_exists(self):
        """Check if the model's table exists"""
        table_name = self.model._meta.db_table
        # Check if table exists in any of the schemas in search_path
        return table_exists(table_name)


@admin.register(CoreOffers)
class CoreOffersAdmin(BasePricingAdmin):
    """Admin interface for CoreOffers"""
    list_display = ('offer_id', 'vendor', 'product_name_clean', 'vendor_category_id', 'vendor_subcategory_id')
    list_filter = ('vendor', 'vendor_category_id')
    search_fields = ('offer_id', 'product_name_clean', 'vendor')
    readonly_fields = ('offer_id', 'vendor', 'url', 'image_url', 'product_name_clean', 
                      'vendor_subcategory_id', 'vendor_category_id', 'vendor_brand_id')
    ordering = ('-offer_id',)
    
    def has_add_permission(self, request):
        return False  # Read-only since managed=False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(CorePrices)
class CorePricesAdmin(BasePricingAdmin):
    """Admin interface for CorePrices"""
    list_display = ('offer_id', 'price_value', 'currency', 'observed_at')
    list_filter = ('currency', 'observed_at')
    search_fields = ('offer_id',)
    readonly_fields = ('field_synthetic_field', 'offer_id', 'price_value', 'currency', 'observed_at')
    date_hierarchy = 'observed_at'
    ordering = ('-observed_at',)
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(VLastestOfferPrices)
class VLastestOfferPricesAdmin(BasePricingAdmin):
    """Admin interface for Latest Offer Prices view"""
    list_display = ('offer_id', 'price_value', 'currency', 'observed_at')
    list_filter = ('currency', 'observed_at')
    search_fields = ('offer_id',)
    readonly_fields = ('offer_id', 'price_value', 'currency', 'observed_at')
    date_hierarchy = 'observed_at'
    ordering = ('-price_value',)
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(DimProduct)
class DimProductAdmin(BasePricingAdmin):
    """Admin interface for DimProduct"""
    list_display = ('product_id', 'display_name', 'display_image_url')
    search_fields = ('product_id', 'display_name')
    readonly_fields = ('product_id', 'display_name', 'display_image_url')
    ordering = ('product_id',)
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(DimVendorCategory)
class DimVendorCategoryAdmin(BasePricingAdmin):
    """Admin interface for DimVendorCategory"""
    list_display = ('vendor_category_id', 'vendor', 'vendor_category_name')
    list_filter = ('vendor',)
    search_fields = ('vendor_category_id', 'vendor_category_name', 'vendor')
    readonly_fields = ('vendor_category_id', 'vendor', 'vendor_category_name')
    ordering = ('vendor', 'vendor_category_name')
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(DimVendorSubcategory)
class DimVendorSubcategoryAdmin(BasePricingAdmin):
    """Admin interface for DimVendorSubcategory"""
    list_display = ('vendor_subcategory_id', 'vendor', 'vendor_category_name', 'vendor_subcategory_name')
    list_filter = ('vendor', 'vendor_category_name')
    search_fields = ('vendor_subcategory_id', 'vendor_subcategory_name', 'vendor_category_name', 'vendor')
    readonly_fields = ('vendor_subcategory_id', 'vendor_category_id', 'vendor', 
                     'vendor_category_name', 'vendor_subcategory_name')
    ordering = ('vendor', 'vendor_category_name', 'vendor_subcategory_name')
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(DimBrand)
class DimBrandAdmin(BasePricingAdmin):
    """Admin interface for DimBrand"""
    list_display = ('brand_id', 'brand_name')
    search_fields = ('brand_id', 'brand_name')
    readonly_fields = ('brand_id', 'brand_name')
    ordering = ('brand_name',)
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(OfferProductMap)
class OfferProductMapAdmin(BasePricingAdmin):
    """Admin interface for OfferProductMap"""
    list_display = ('offer_id', 'product_id', 'confidence')
    list_filter = ('confidence',)
    search_fields = ('offer_id', 'product_id')
    readonly_fields = ('offer_id', 'product_id', 'confidence')
    ordering = ('offer_id',)
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False
