from rest_framework import serializers
from .models import Review, ReviewHelpful
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.Serializer):
    """Simple user serializer for review responses"""
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)


class ReviewHelpfulSerializer(serializers.ModelSerializer):
    """Serializer for helpful votes"""
    class Meta:
        model = ReviewHelpful
        fields = ['id', 'user', 'review', 'is_helpful', 'created_at']
        read_only_fields = ['user', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for Review model with helpful vote counts"""
    user = UserSerializer(read_only=True)
    helpful_count = serializers.IntegerField(read_only=True)
    not_helpful_count = serializers.IntegerField(read_only=True)
    user_helpful_vote = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id',
            'user',
            'product_id',
            'rating',
            'comment',
            'created_at',
            'updated_at',
            'helpful_count',
            'not_helpful_count',
            'user_helpful_vote',
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_user_helpful_vote(self, obj):
        """Get the current user's helpful vote if authenticated"""
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            try:
                helpful_vote = ReviewHelpful.objects.get(user=request.user, review=obj)
                return helpful_vote.is_helpful
            except ReviewHelpful.DoesNotExist:
                return None
        return None


class ReviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating reviews"""
    class Meta:
        model = Review
        fields = ['product_id', 'rating', 'comment']
        extra_kwargs = {
            'rating': {'required': True},
            'comment': {'required': False, 'allow_blank': True},
        }

    def validate_rating(self, value):
        """Ensure rating is between 1 and 5"""
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate_comment(self, value):
        """Optional validation for comment length"""
        if value and len(value) > 1000:
            raise serializers.ValidationError("Comment cannot exceed 1000 characters.")
        return value
