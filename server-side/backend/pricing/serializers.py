from rest_framework import serializers


class OfferSerializer(serializers.Serializer):
    offer_id = serializers.CharField()
    product_id = serializers.IntegerField(allow_null=True)
    product_name = serializers.CharField()
    price = serializers.DecimalField(max_digits=18, decimal_places=2)
    currency = serializers.CharField()
    vendor = serializers.CharField()
    product_image = serializers.CharField(allow_null=True)
    url = serializers.CharField()
    scraped_at = serializers.DateTimeField()

    category_id = serializers.CharField(allow_null=True)
    category = serializers.CharField(allow_null=True)
    subcategory_id = serializers.CharField(allow_null=True)
    subcategory = serializers.CharField(allow_null=True)


class ProductListItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    name = serializers.CharField()
    image_url = serializers.CharField(allow_null=True)
    price = serializers.DecimalField(max_digits=18, decimal_places=2, allow_null=True)
    currency = serializers.CharField(allow_null=True)
    vendor = serializers.CharField(allow_null=True)
    url = serializers.CharField(allow_null=True)
    scraped_at = serializers.DateTimeField(allow_null=True)
    offers_count = serializers.IntegerField()


class ReviewStatsSerializer(serializers.Serializer):
    average_rating = serializers.FloatField(allow_null=True)
    total_reviews = serializers.IntegerField()
    rating_distribution = serializers.DictField(child=serializers.IntegerField())


class ProductDetailSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    name = serializers.CharField()
    category = serializers.CharField(allow_null=True)
    category_id = serializers.CharField(allow_null=True)

    subcategory = serializers.CharField(allow_null=True)
    subcategory_id = serializers.CharField(allow_null=True)

    brand = serializers.CharField(allow_null=True)
    description = serializers.CharField(allow_null=True)
    image_url = serializers.CharField(allow_null=True)
    currency = serializers.CharField(allow_null=True)
    cheapest_offer = serializers.DictField(allow_null=True)
    offers_count = serializers.IntegerField()
    review_stats = ReviewStatsSerializer(allow_null=True, required=False)
    review_stats = ReviewStatsSerializer(allow_null=True)


class PriceHistoryPointSerializer(serializers.Serializer):
    vendor = serializers.CharField()
    price = serializers.DecimalField(max_digits=18, decimal_places=2)
    scraped_at = serializers.DateTimeField()


class PriceHistorySerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    product_name = serializers.CharField()
    history = PriceHistoryPointSerializer(many=True)


class VendorSerializer(serializers.Serializer):
    name = serializers.CharField()
    display_name = serializers.CharField()
    logo = serializers.CharField()



class SubcategoryInCategorySerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()


class CategoryWithSubSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    subcategories = SubcategoryInCategorySerializer(many=True)


class CategoryListResponseSerializer(serializers.Serializer):
    categories = CategoryWithSubSerializer(many=True)


class SubcategorySerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    category_id = serializers.CharField()
    category_name = serializers.CharField()
