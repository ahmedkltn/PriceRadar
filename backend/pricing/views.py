from decimal import Decimal

from django.db.models import OuterRef, Subquery
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    CoreOffers,
    CorePrices,
    VLastestOfferPrices,
    DimVendorSubcategory,
    DimVendorCategory,
)
from .serializers import (
    OfferSerializer,
    ProductDetailSerializer,
    PriceHistorySerializer,
    VendorSerializer,
    CategoryListResponseSerializer,
    SubcategorySerializer,
)
from .pagination import OfferPagination


class OfferListView(APIView):
    """
    GET /api/v1/offers

    Query params:
      - q: search in product_name_clean
      - min_price, max_price
      - vendor
      - category: category name (Laptops, Smartphones, ...)
      - category_id: vendor_category_id
      - subcategory_id: vendor_subcategory_id
      - sort: price_asc | price_desc | newest
      - limit, page: pagination
    """

    def get(self, request):
        q = request.GET.get("q")
        min_price = request.GET.get("min_price")
        max_price = request.GET.get("max_price")
        vendor = request.GET.get("vendor")

        category_name_param = request.GET.get("category")        # filter by category name
        category_id_param = request.GET.get("category_id")       # filter by category id
        subcategory_id_param = request.GET.get("subcategory_id") # filter by subcategory id

        sort = request.GET.get("sort", "price_asc")

        # Latest price per offer
        latest_price_qs = VLastestOfferPrices.objects.filter(
            offer_id=OuterRef("offer_id")
        )

        # Category / subcategory info from DimVendorSubcategory
        subcat_qs = DimVendorSubcategory.objects.filter(
            vendor_subcategory_id=OuterRef("vendor_subcategory_id")
        )

        offers = (
            CoreOffers.objects
            .annotate(
                price_value=Subquery(latest_price_qs.values("price_value")[:1]),
                currency=Subquery(latest_price_qs.values("currency")[:1]),
                observed_at=Subquery(latest_price_qs.values("observed_at")[:1]),
                category_id=Subquery(subcat_qs.values("vendor_category_id")[:1]),
                category_name=Subquery(subcat_qs.values("vendor_category_name")[:1]),
                subcategory_name=Subquery(subcat_qs.values("vendor_subcategory_name")[:1]),
            )
            .exclude(price_value__isnull=True)
        )

        # --- Filters ---

        if q:
            offers = offers.filter(product_name_clean__icontains=q)

        if vendor:
            offers = offers.filter(vendor__iexact=vendor)

        # Category filter: prefer category_id, fallback to category name
        if category_id_param:
            offers = offers.filter(category_id=category_id_param)
        elif category_name_param:
            offers = offers.filter(category_name__iexact=category_name_param)

        # Subcategory filter
        if subcategory_id_param:
            offers = offers.filter(vendor_subcategory_id=subcategory_id_param)

        # Price filters
        if min_price:
            try:
                offers = offers.filter(price_value__gte=Decimal(min_price))
            except Exception:
                pass

        if max_price:
            try:
                offers = offers.filter(price_value__lte=Decimal(max_price))
            except Exception:
                pass

        # --- Sorting ---

        if sort == "price_asc":
            offers = offers.order_by("price_value")
        elif sort == "price_desc":
            offers = offers.order_by("-price_value")
        elif sort == "newest":
            offers = offers.order_by("-observed_at")
        else:
            offers = offers.order_by("price_value")

        # --- Pagination ---

        paginator = OfferPagination()
        page_qs = paginator.paginate_queryset(offers, request)

        data = []
        for o in page_qs:
            data.append({
                "offer_id": o.offer_id,
                "product_id": o.offer_id,  # alpha: product_id == offer_id
                "product_name": o.product_name_clean,
                "price": o.price_value,
                "currency": o.currency,
                "vendor": o.vendor,
                "product_image": o.image_url,
                "url": o.url,
                "scraped_at": o.observed_at,
                "category_id": o.category_id,
                "category": o.category_name,
                "subcategory_id": o.vendor_subcategory_id,
                "subcategory": o.subcategory_name,
            })

        serializer = OfferSerializer(data, many=True)
        return paginator.get_paginated_response(serializer.data)


class ProductDetailView(APIView):
    """
    GET /api/v1/products/{product_id}

    Alpha: product_id == offer_id (CoreOffers.offer_id)
    """

    def get(self, request, product_id):
        offer_id = str(product_id)

        try:
            offer = (
                CoreOffers.objects
                .filter(offer_id=offer_id)
                .annotate(
                    price_value=Subquery(
                        VLastestOfferPrices.objects
                        .filter(offer_id=OuterRef("offer_id"))
                        .values("price_value")[:1]
                    ),
                    currency=Subquery(
                        VLastestOfferPrices.objects
                        .filter(offer_id=OuterRef("offer_id"))
                        .values("currency")[:1]
                    ),
                    observed_at=Subquery(
                        VLastestOfferPrices.objects
                        .filter(offer_id=OuterRef("offer_id"))
                        .values("observed_at")[:1]
                    ),
                    category_id=Subquery(
                        DimVendorSubcategory.objects
                        .filter(vendor_subcategory_id=OuterRef("vendor_subcategory_id"))
                        .values("vendor_category_id")[:1]
                    ),
                    category_name=Subquery(
                        DimVendorSubcategory.objects
                        .filter(vendor_subcategory_id=OuterRef("vendor_subcategory_id"))
                        .values("vendor_category_name")[:1]
                    ),
                    subcategory_name=Subquery(
                        DimVendorSubcategory.objects
                        .filter(vendor_subcategory_id=OuterRef("vendor_subcategory_id"))
                        .values("vendor_subcategory_name")[:1]
                    ),
                )
                .get()
            )
        except CoreOffers.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        cheapest_offer = {
            "vendor": offer.vendor,
            "price": offer.price_value,
            "url": offer.url,
            "scraped_at": offer.observed_at,
        }

        payload = {
            "product_id": offer_id,
            "name": offer.product_name_clean,
            "category": offer.category_name,
            "category_id": offer.category_id,
            "subcategory": offer.subcategory_name,
            "subcategory_id": offer.vendor_subcategory_id,
            "brand": None,          # to be filled later when you have dim_product
            "description": None,    # same
            "image_url": offer.image_url,
            "cheapest_offer": cheapest_offer,
            "offers_count": 1,      # later: count all offers mapped to same product
        }

        serializer = ProductDetailSerializer(payload)
        return Response(serializer.data)


class ProductPriceHistoryView(APIView):
    """
    GET /api/v1/products/{product_id}/price-history

    Alpha: product_id == offer_id
    Query params:
      - vendor (optional)
    """

    def get(self, request, product_id):
        vendor_filter = request.GET.get("vendor")
        offer_id = str(product_id)

        try:
            offer = CoreOffers.objects.get(offer_id=offer_id)
        except CoreOffers.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        prices = CorePrices.objects.filter(offer_id=offer_id).order_by("observed_at")

        if vendor_filter:
            # we only have vendor on CoreOffers, not on CorePrices
            if (offer.vendor or "").lower() != vendor_filter.lower():
                prices = CorePrices.objects.none()

        history = [
            {
                "vendor": offer.vendor,
                "price": p.price_value,
                "scraped_at": p.observed_at,
            }
            for p in prices
        ]

        payload = {
            "product_id": offer_id,
            "product_name": offer.product_name_clean,
            "history": history,
        }

        serializer = PriceHistorySerializer(payload)
        return Response(serializer.data)


class VendorListView(APIView):
    """
    GET /api/v1/vendors
    """

    def get(self, request):
        vendors = (
            CoreOffers.objects
            .values_list("vendor", flat=True)
            .distinct()
            .order_by("vendor")
        )

        data = []
        for v in vendors:
            if not v:
                continue
            name = v.strip()
            data.append({
                "name": name,
                "display_name": name.capitalize(),
                "logo": f"https://cdn.priceradar.tn/vendors/{name.lower()}.png",
            })

        serializer = VendorSerializer(data, many=True)
        return Response({"vendors": serializer.data})


class CategoryListView(APIView):
    """
    GET /api/v1/categories

    Returns all categories with their subcategories:
    {
      "categories": [
        {
          "id": "<vendor_category_id>",
          "name": "<vendor_category_name>",
          "subcategories": [
            { "id": "<vendor_subcategory_id>", "name": "<vendor_subcategory_name>" }
          ]
        },
        ...
      ]
    }
    """

    def get(self, request):
        # Gather all subcategories first
        subcats = DimVendorSubcategory.objects.values(
            "vendor_category_id",
            "vendor_subcategory_id",
            "vendor_subcategory_name",
        )

        # category_id -> list of subcategories
        sub_map = {}
        for s in subcats:
            cid = s["vendor_category_id"]
            sub_map.setdefault(cid, []).append({
                "id": s["vendor_subcategory_id"],
                "name": s["vendor_subcategory_name"],
            })

        categories_qs = (
            DimVendorCategory.objects
            .order_by("vendor_category_name")
            .values("vendor_category_id", "vendor_category_name")
        )

        categories_list = []
        for c in categories_qs:
            cid = c["vendor_category_id"]
            categories_list.append({
                "id": cid,
                "name": c["vendor_category_name"],
                "subcategories": sub_map.get(cid, []),
            })

        serializer = CategoryListResponseSerializer({"categories": categories_list})
        return Response(serializer.data)


class SubcategoryListView(APIView):
    """
    GET /api/v1/subcategories
    Optional query:
      - category_id: filter subcategories by vendor_category_id
    """

    def get(self, request):
        category_id = request.GET.get("category_id")

        qs = DimVendorSubcategory.objects.all()

        if category_id:
            qs = qs.filter(vendor_category_id=category_id)

        qs = qs.order_by("vendor_category_name", "vendor_subcategory_name")

        data = [
            {
                "id": s.vendor_subcategory_id,
                "name": s.vendor_subcategory_name,
                "category_id": s.vendor_category_id,
                "category_name": s.vendor_category_name,
            }
            for s in qs
        ]

        serializer = SubcategorySerializer(data, many=True)
        return Response({"subcategories": serializer.data})
