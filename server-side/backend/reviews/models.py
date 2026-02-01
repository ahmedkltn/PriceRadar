from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class Review(models.Model):
    """Product review and rating model"""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    product_id = models.IntegerField(db_index=True, help_text="References DimProduct.product_id")
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5 stars"
    )
    comment = models.TextField(blank=True, null=True, help_text="Optional review text")
    is_active = models.BooleanField(default=True, help_text="Soft delete flag")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'reviews'
        # Note: unique_together removed - using partial unique index via migration
        # to only enforce uniqueness when is_active=True
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['product_id', 'is_active']),
            models.Index(fields=['user', 'product_id']),
            models.Index(fields=['rating']),
        ]
        constraints = [
            # Partial unique constraint: only one active review per user per product
            models.UniqueConstraint(
                fields=['user', 'product_id'],
                condition=models.Q(is_active=True),
                name='unique_active_user_product_review'
            ),
        ]

    def __str__(self):
        return f"{self.user.username} - Product {self.product_id} - {self.rating} stars"


class ReviewHelpful(models.Model):
    """Model to track helpful/not helpful votes on reviews"""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='helpful_votes'
    )
    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name='helpful_votes'
    )
    is_helpful = models.BooleanField(
        help_text="True for helpful, False for not helpful"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'review_helpful'
        unique_together = [['user', 'review']]
        indexes = [
            models.Index(fields=['review', 'is_helpful']),
        ]

    def __str__(self):
        vote_type = "helpful" if self.is_helpful else "not helpful"
        return f"{self.user.username} - {vote_type} - Review {self.review.id}"
