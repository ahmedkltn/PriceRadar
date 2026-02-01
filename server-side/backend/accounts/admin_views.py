from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Count, Q, Sum, Avg, Max, Min
from django.utils import timezone
from datetime import timedelta
from drf_spectacular.utils import extend_schema

try:
    from pricing.models import (
        CoreOffers,
        CorePrices,
        VLastestOfferPrices,
        DimProduct,
        DimVendorCategory,
        DimVendorSubcategory,
        OfferProductMap,
    )
except ImportError:
    # Models might not be available in all contexts
    CoreOffers = None
    CorePrices = None
    VLastestOfferPrices = None
    DimProduct = None
    DimVendorCategory = None
    DimVendorSubcategory = None
    OfferProductMap = None

User = get_user_model()


class IsSuperUser(permissions.BasePermission):
    """Permission check for superuser only"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_superuser


class AdminDashboardView(APIView):
    """Admin dashboard with key statistics"""
    permission_classes = [IsSuperUser]

    @extend_schema(
        summary='Admin Dashboard Statistics',
        description='Get overview statistics for admin dashboard (superuser only)',
    )
    def get(self, request):
        # User statistics
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        staff_users = User.objects.filter(is_staff=True).count()
        new_users_today = User.objects.filter(date_joined__date=timezone.now().date()).count()
        new_users_week = User.objects.filter(
            date_joined__gte=timezone.now() - timedelta(days=7)
        ).count()

        # Helper function to safely count
        def safe_count(model, default=0):
            if not model:
                return default
            try:
                return model.objects.count()
            except Exception:
                return default
        
        def safe_aggregate(model, aggregations, default=None):
            if not model:
                return default or {}
            try:
                return model.objects.aggregate(**aggregations)
            except Exception:
                return default or {}
        
        def safe_filter_count(model, filter_kwargs, default=0):
            if not model:
                return default
            try:
                return model.objects.filter(**filter_kwargs).count()
            except Exception:
                return default
        
        # Product statistics
        total_products = safe_count(DimProduct)
        if OfferProductMap and DimProduct:
            try:
                products_with_offers = DimProduct.objects.filter(
                    offerproductmap__isnull=False
                ).distinct().count()
            except Exception:
                products_with_offers = 0
        else:
            products_with_offers = 0

        # Offer statistics
        total_offers = safe_count(CoreOffers)
        active_offers = safe_count(VLastestOfferPrices)
        
        # Price statistics
        price_stats = safe_aggregate(
            CorePrices,
            {
                'total_prices': Count('offer_id'),
                'avg_price': Avg('price_value'),
                'max_price': Max('price_value'),
                'min_price': Min('price_value'),
            },
            {'total_prices': 0, 'avg_price': 0, 'max_price': 0, 'min_price': 0}
        )
        recent_prices = safe_filter_count(
            CorePrices,
            {'observed_at__gte': timezone.now() - timedelta(days=1)}
        )

        # Category statistics
        total_categories = safe_count(DimVendorCategory)
        total_subcategories = safe_count(DimVendorSubcategory)

        return Response({
            'users': {
                'total': total_users,
                'active': active_users,
                'staff': staff_users,
                'new_today': new_users_today,
                'new_this_week': new_users_week,
            },
            'products': {
                'total': total_products,
                'with_offers': products_with_offers,
                'without_offers': total_products - products_with_offers,
            },
            'offers': {
                'total': total_offers,
                'active': active_offers,
                'inactive': total_offers - active_offers,
            },
            'prices': {
                'total_records': price_stats.get('total_prices', 0),
                'average': float(price_stats.get('avg_price', 0) or 0),
                'max': float(price_stats.get('max_price', 0) or 0),
                'min': float(price_stats.get('min_price', 0) or 0),
                'recent_24h': recent_prices,
            },
            'categories': {
                'total': total_categories,
                'subcategories': total_subcategories,
            },
        })


class AdminUsersListView(APIView):
    """List all users with details (admin only)"""
    permission_classes = [IsSuperUser]

    @extend_schema(
        summary='List All Users',
        description='Get list of all users with details (superuser only)',
    )
    def get(self, request):
        search = request.GET.get('search', '')
        is_active = request.GET.get('is_active')
        is_staff = request.GET.get('is_staff')
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 50))

        queryset = User.objects.all()

        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        if is_staff is not None:
            queryset = queryset.filter(is_staff=is_staff.lower() == 'true')

        total = queryset.count()
        start = (page - 1) * limit
        end = start + limit
        users = queryset[start:end]

        users_data = []
        for user in users:
            users_data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_active': user.is_active,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'date_joined': user.date_joined.isoformat(),
                'last_login': user.last_login.isoformat() if user.last_login else None,
            })

        return Response({
            'total': total,
            'page': page,
            'limit': limit,
            'users': users_data,
        })


class AdminUserDetailView(APIView):
    """Get detailed information about a specific user"""
    permission_classes = [IsSuperUser]

    @extend_schema(
        summary='Get User Details',
        description='Get detailed information about a specific user (superuser only)',
    )
    def get(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_active': user.is_active,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'date_joined': user.date_joined.isoformat(),
                'last_login': user.last_login.isoformat() if user.last_login else None,
                'groups': [g.name for g in user.groups.all()],
                'user_permissions': [p.codename for p in user.user_permissions.all()],
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class AdminDatabaseStatsView(APIView):
    """Get database statistics and health metrics"""
    permission_classes = [IsSuperUser]

    @extend_schema(
        summary='Database Statistics',
        description='Get database statistics and health metrics (superuser only)',
    )
    def get(self, request):
        from django.db import connection

        # Table sizes (approximate)
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    schemaname,
                    tablename,
                    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
                FROM pg_tables
                WHERE schemaname IN ('public', 'public_core', 'public_marts', 'public_staging', 'raw')
                ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
                LIMIT 20
            """)
            table_sizes = [
                {'schema': row[0], 'table': row[1], 'size': row[2]}
                for row in cursor.fetchall()
            ]

        # Record counts by schema
        stats = {
            'users': User.objects.count(),
        }
        
        if DimProduct:
            stats['products'] = DimProduct.objects.count()
        if CoreOffers:
            stats['offers'] = CoreOffers.objects.count()
        if CorePrices:
            stats['prices'] = CorePrices.objects.count()
        if VLastestOfferPrices:
            stats['latest_prices'] = VLastestOfferPrices.objects.count()
        if DimVendorCategory:
            stats['categories'] = DimVendorCategory.objects.count()
        if DimVendorSubcategory:
            stats['subcategories'] = DimVendorSubcategory.objects.count()

        return Response({
            'table_sizes': table_sizes,
            'record_counts': stats,
            'database_name': connection.settings_dict['NAME'],
        })
