from django.contrib import admin
from django.db.models import Count, Q
from .models import Review, ReviewHelpful


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'product_id', 'rating', 'is_active', 'created_at', 'helpful_count_display')
    list_filter = ('rating', 'is_active', 'created_at')
    search_fields = ('user__username', 'product_id', 'comment')
    raw_id_fields = ('user',)
    readonly_fields = ('created_at', 'updated_at')
    actions = ['deactivate_reviews', 'activate_reviews']

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.annotate(
            _helpful_count=Count('helpful_votes', filter=Q(helpful_votes__is_helpful=True))
        )
        return queryset

    def helpful_count_display(self, obj):
        return getattr(obj, '_helpful_count', 0)
    helpful_count_display.short_description = 'Helpful Votes'
    helpful_count_display.admin_order_field = '_helpful_count'

    def deactivate_reviews(self, request, queryset):
        queryset.update(is_active=False)
    deactivate_reviews.short_description = "Deactivate selected reviews"

    def activate_reviews(self, request, queryset):
        queryset.update(is_active=True)
    activate_reviews.short_description = "Activate selected reviews"


@admin.register(ReviewHelpful)
class ReviewHelpfulAdmin(admin.ModelAdmin):
    list_display = ('user', 'review', 'is_helpful', 'created_at')
    list_filter = ('is_helpful', 'created_at')
    search_fields = ('user__username', 'review__id')
    raw_id_fields = ('user', 'review')
    readonly_fields = ('created_at',)
