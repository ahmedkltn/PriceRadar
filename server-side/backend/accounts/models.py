from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
from django.db import models


# Using Django's default User model for now
# If custom fields are needed later, extend AbstractUser here
# class User(AbstractUser):
#     email_verified = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)


class SavedProduct(models.Model):
    """Model to store user's saved/favorited products"""
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name='saved_products'
    )
    product_id = models.IntegerField()
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [['user', 'product_id']]
        ordering = ['-saved_at']
        indexes = [
            models.Index(fields=['user', 'product_id']),
        ]

    def __str__(self):
        return f"{self.user.username} - Product {self.product_id}"
