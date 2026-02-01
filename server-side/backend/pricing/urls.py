from django.urls import path
from .views import (
    OfferListView,
    ProductDetailView,
    ProductPriceHistoryView,
    VendorListView,
    CategoryListView,
    ProductListView,
)

urlpatterns = [
    path("api/v1/offers", OfferListView.as_view(), name="offer-list"),

    path("api/v1/products", ProductListView.as_view(), name="product-list"),
    path("api/v1/products/<str:product_id>", ProductDetailView.as_view(), name="product-detail"),
    path(
        "api/v1/products/<str:product_id>/price-history",
        ProductPriceHistoryView.as_view(),
        name="product-price-history",
    ),
    path("api/v1/vendors", VendorListView.as_view(), name="vendor-list"),
    path("api/v1/categories", CategoryListView.as_view(), name="category-list"),
]
