from decimal import Decimal

from django.db.models import Count, OuterRef, Subquery
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    CoreOffers,
    CorePrices,
    VLastestOfferPrices,
    DimVendorSubcategory,
    DimVendorCategory,
    DimProduct,
    OfferProductMap,
)
from .serializers import (
    OfferSerializer,
    ProductListItemSerializer,
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

        # Offer -> Product mapping
        map_qs = OfferProductMap.objects.filter(offer_id=OuterRef("offer_id"))

        offers = (
            CoreOffers.objects
            .annotate(
                price_value=Subquery(latest_price_qs.values("price_value")[:1]),
                currency=Subquery(latest_price_qs.values("currency")[:1]),
                observed_at=Subquery(latest_price_qs.values("observed_at")[:1]),
                category_id=Subquery(subcat_qs.values("vendor_category_id")[:1]),
                category_name=Subquery(subcat_qs.values("vendor_category_name")[:1]),
                subcategory_name=Subquery(subcat_qs.values("vendor_subcategory_name")[:1]),
                product_id=Subquery(map_qs.values("product_id")[:1]),
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
                "product_id": o.product_id,
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


class ProductListView(APIView):
    """
    GET /api/v1/products

    Query params:
      - q: search in dim_product.display_name
      - min_price, max_price: filter by cheapest current price across mapped offers
      - sort: price_asc | price_desc | newest
      - limit, page: pagination
    """

    def get(self, request):
        q = request.GET.get("q")
        min_price = request.GET.get("min_price")
        max_price = request.GET.get("max_price")
        sort = request.GET.get("sort", "price_asc")

        # Latest price per offer (view)
        latest_price_qs = VLastestOfferPrices.objects.filter(offer_id=OuterRef("offer_id"))

        # For each product, look at its mapped offers, attach latest price, then pick the cheapest offer
        cheapest_mapped_offer_qs = (
            OfferProductMap.objects
            .filter(product_id=OuterRef("product_id"))
            .annotate(
                price_value=Subquery(latest_price_qs.values("price_value")[:1]),
                currency=Subquery(latest_price_qs.values("currency")[:1]),
                observed_at=Subquery(latest_price_qs.values("observed_at")[:1]),
            )
            .exclude(price_value__isnull=True)
            .order_by("price_value")
        )

        cheapest_offer_id_sq = Subquery(cheapest_mapped_offer_qs.values("offer_id")[:1])

        # Pull vendor + url for the cheapest offer
        cheapest_offer_qs = CoreOffers.objects.filter(offer_id=OuterRef("cheapest_offer_id"))

        # Offers count
        offers_count_qs = (
            OfferProductMap.objects
            .filter(product_id=OuterRef("product_id"))
            .values("product_id")
            .annotate(c=Count("offer_id"))
            .values("c")
        )

        products = (
            DimProduct.objects
            .annotate(
                cheapest_offer_id=cheapest_offer_id_sq,
                price_value=Subquery(cheapest_mapped_offer_qs.values("price_value")[:1]),
                currency=Subquery(cheapest_mapped_offer_qs.values("currency")[:1]),
                observed_at=Subquery(cheapest_mapped_offer_qs.values("observed_at")[:1]),
                vendor=Subquery(cheapest_offer_qs.values("vendor")[:1]),
                url=Subquery(cheapest_offer_qs.values("url")[:1]),
                offers_count=Subquery(offers_count_qs[:1]),
            )
        )

        # --- Filters ---
        if q:
            products = products.filter(display_name__icontains=q)

        if min_price:
            try:
                products = products.filter(price_value__gte=Decimal(min_price))
            except Exception:
                pass

        if max_price:
            try:
                products = products.filter(price_value__lte=Decimal(max_price))
            except Exception:
                pass

        # --- Sorting ---
        if sort == "price_asc":
            products = products.order_by("price_value")
        elif sort == "price_desc":
            products = products.order_by("-price_value")
        elif sort == "newest":
            products = products.order_by("-observed_at")
        else:
            products = products.order_by("price_value")

        # --- Pagination ---
        paginator = OfferPagination()
        page_qs = paginator.paginate_queryset(products, request)

        data = []
        for p in page_qs:
            data.append({
                "product_id": p.product_id,
                "name": p.display_name,
                "image_url": p.display_image_url,
                "price": p.price_value,
                "currency": p.currency,
                "vendor": p.vendor,
                "url": p.url,
                "scraped_at": p.observed_at,
                "offers_count": int(p.offers_count or 0),
            })

        serializer = ProductListItemSerializer(data, many=True)
        return paginator.get_paginated_response(serializer.data)


class ProductDetailView(APIView):
    """
    GET /api/v1/products/{product_id}

    Canonical product endpoint backed by dim_product + offer_product_map.
    """

    def get(self, request, product_id):
        try:
            product = DimProduct.objects.get(product_id=int(product_id))
        except (DimProduct.DoesNotExist, ValueError, TypeError):
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        # Offers mapped to this product
        mapped_offer_ids = OfferProductMap.objects.filter(
            product_id=product.product_id
        ).values_list("offer_id", flat=True)

        # Latest price per offer
        latest_price_qs = VLastestOfferPrices.objects.filter(
            offer_id=OuterRef("offer_id")
        )

        # Category/subcategory info
        subcat_qs = DimVendorSubcategory.objects.filter(
            vendor_subcategory_id=OuterRef("vendor_subcategory_id")
        )

        offers_qs = (
            CoreOffers.objects
            .filter(offer_id__in=mapped_offer_ids)
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

        # Compute cheapest offer
        cheapest = offers_qs.order_by("price_value").first()
        cheapest_offer = None
        if cheapest:
            cheapest_offer = {
                "vendor": cheapest.vendor,
                "price": cheapest.price_value,
                "url": cheapest.url,
                "scraped_at": cheapest.observed_at,
            }

        payload = {
            "product_id": product.product_id,
            "name": product.display_name,
            "category": getattr(cheapest, "category_name", None) if cheapest else None,
            "category_id": getattr(cheapest, "category_id", None) if cheapest else None,
            "subcategory": getattr(cheapest, "subcategory_name", None) if cheapest else None,
            "subcategory_id": getattr(cheapest, "vendor_subcategory_id", None) if cheapest else None,
            "brand": None,
            "description": None,
            "image_url": product.display_image_url,
            "cheapest_offer": cheapest_offer,
            "offers_count": offers_qs.count(),
        }

        serializer = ProductDetailSerializer(payload)
        return Response(serializer.data)


class ProductPriceHistoryView(APIView):
    """
    GET /api/v1/products/{product_id}/price-history

    Product-level history backed by offer_product_map + core_prices.

    Query params:
      - vendor (optional): restrict to one vendor's offer series
    """

    def get(self, request, product_id):
        vendor_filter = request.GET.get("vendor")

        try:
            product = DimProduct.objects.get(product_id=int(product_id))
        except (DimProduct.DoesNotExist, ValueError, TypeError):
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        offer_ids_qs = OfferProductMap.objects.filter(
            product_id=product.product_id
        ).values_list("offer_id", flat=True)

        offers_qs = CoreOffers.objects.filter(offer_id__in=offer_ids_qs)
        if vendor_filter:
            offers_qs = offers_qs.filter(vendor__iexact=vendor_filter)

        offer_ids = list(offers_qs.values_list("offer_id", flat=True))
        if not offer_ids:
            payload = {
                "product_id": product.product_id,
                "product_name": product.display_name,
                "history": [],
            }
            serializer = PriceHistorySerializer(payload)
            return Response(serializer.data)

        prices = CorePrices.objects.filter(offer_id__in=offer_ids).order_by("observed_at")

        vendor_map = {o.offer_id: o.vendor for o in offers_qs}

        history = [
            {
                "vendor": vendor_map.get(p.offer_id),
                "price": p.price_value,
                "scraped_at": p.observed_at,
            }
            for p in prices
        ]

        payload = {
            "product_id": product.product_id,
            "product_name": product.display_name,
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
