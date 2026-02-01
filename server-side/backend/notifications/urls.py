from django.urls import path
from .views import (
    NotificationListView,
    NotificationMarkReadView,
    NotificationMarkAllReadView,
    NotificationPreferenceView,
    NotificationStatsView,
)

app_name = 'notifications'

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification_list'),
    path('<int:notification_id>/read/', NotificationMarkReadView.as_view(), name='notification_mark_read'),
    path('mark-all-read/', NotificationMarkAllReadView.as_view(), name='notification_mark_all_read'),
    path('preferences/', NotificationPreferenceView.as_view(), name='notification_preferences'),
    path('stats/', NotificationStatsView.as_view(), name='notification_stats'),
]
