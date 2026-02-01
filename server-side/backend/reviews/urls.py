from django.urls import path
from .views import ReviewListView, ReviewDeleteView, ReviewHelpfulView

app_name = 'reviews'

urlpatterns = [
    path('reviews/', ReviewListView.as_view(), name='review_list_create'),
    path('reviews/<int:pk>/', ReviewDeleteView.as_view(), name='review_delete'),
    path('reviews/<int:review_id>/helpful/', ReviewHelpfulView.as_view(), name='review_helpful'),
]
