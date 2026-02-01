from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.db.models import Q, Count, Avg
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, OpenApiParameter

from .models import Review, ReviewHelpful
from .serializers import ReviewSerializer, ReviewCreateSerializer, ReviewHelpfulSerializer
from .pagination import ReviewPagination


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners to delete their own reviews"""
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the owner
        return obj.user == request.user


class ReviewListView(generics.ListCreateAPIView):
    """
    GET /api/reviews/?product_id=X
    List reviews for a product (paginated, ordered by helpful_count desc, then created_at desc)
    
    POST /api/reviews/
    Create a new review (authenticated only)
    """
    serializer_class = ReviewSerializer
    pagination_class = ReviewPagination
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.request.query_params.get('product_id')
        if not product_id:
            return Review.objects.none()
        
        try:
            product_id = int(product_id)
        except (ValueError, TypeError):
            return Review.objects.none()

        queryset = Review.objects.filter(
            product_id=product_id,
            is_active=True
        ).select_related('user')

        # Annotate helpful and not helpful counts
        queryset = queryset.annotate(
            helpful_count=Count('helpful_votes', filter=Q(helpful_votes__is_helpful=True)),
            not_helpful_count=Count('helpful_votes', filter=Q(helpful_votes__is_helpful=False))
        ).order_by('-helpful_count', '-created_at')

        return queryset

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ReviewCreateSerializer
        return ReviewSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='product_id',
                type=int,
                location=OpenApiParameter.QUERY,
                required=True,
                description='Product ID to filter reviews'
            ),
        ],
        responses={200: ReviewSerializer(many=True)}
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def perform_create(self, serializer):
        # Check if user already has an active review for this product
        product_id = serializer.validated_data.get('product_id')
        existing_active_review = Review.objects.filter(
            user=self.request.user,
            product_id=product_id,
            is_active=True
        ).first()

        if existing_active_review:
            raise ValidationError({
                'detail': 'You have already reviewed this product. Please delete your existing review first.'
            })

        # If user had a soft-deleted review, the partial unique constraint will allow
        # creating a new one. Just create the new review normally.
        serializer.save(user=self.request.user)


class ReviewDeleteView(generics.DestroyAPIView):
    """
    DELETE /api/reviews/{id}/
    Delete own review (authenticated, owner only)
    """
    queryset = Review.objects.filter(is_active=True)
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def perform_destroy(self, instance):
        # Soft delete
        instance.is_active = False
        instance.save()


class ReviewHelpfulView(APIView):
    """
    POST /api/reviews/{id}/helpful/
    Toggle helpful vote on a review (authenticated)
    Body: {"is_helpful": true} or {"is_helpful": false}
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        request=ReviewHelpfulSerializer,
        responses={200: ReviewHelpfulSerializer}
    )
    def post(self, request, review_id):
        review = get_object_or_404(Review, id=review_id, is_active=True)
        
        # Prevent users from voting on their own reviews
        if review.user == request.user:
            return Response(
                {'detail': 'You cannot vote on your own review.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        is_helpful = request.data.get('is_helpful')
        if is_helpful is None:
            return Response(
                {'detail': 'is_helpful field is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not isinstance(is_helpful, bool):
            return Response(
                {'detail': 'is_helpful must be a boolean value.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get or create helpful vote
        helpful_vote, created = ReviewHelpful.objects.get_or_create(
            user=request.user,
            review=review,
            defaults={'is_helpful': is_helpful}
        )

        # If vote exists, update it (toggle behavior)
        if not created:
            # If same vote, remove it (toggle off)
            if helpful_vote.is_helpful == is_helpful:
                helpful_vote.delete()
                return Response(
                    {'detail': 'Vote removed.', 'is_helpful': None},
                    status=status.HTTP_200_OK
                )
            # Otherwise, update to new value
            helpful_vote.is_helpful = is_helpful
            helpful_vote.save()

        serializer = ReviewHelpfulSerializer(helpful_vote)
        return Response(serializer.data, status=status.HTTP_200_OK)
