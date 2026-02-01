from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from drf_spectacular.utils import extend_schema, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from django.core.paginator import Paginator

from .models import Notification, NotificationPreference
from .serializers import NotificationSerializer, NotificationPreferenceSerializer
from .services import NotificationService


@method_decorator(csrf_exempt, name='dispatch')
class NotificationListView(APIView):
    """List user notifications with pagination"""
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses={200: NotificationSerializer(many=True)},
        summary='List user notifications',
    )
    def get(self, request):
        """Get paginated list of user notifications"""
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        
        # Pagination
        page = request.query_params.get('page', 1)
        page_size = request.query_params.get('page_size', 20)
        
        try:
            page = int(page)
            page_size = int(page_size)
            page_size = min(page_size, 100)  # Max 100 per page
        except (ValueError, TypeError):
            page = 1
            page_size = 20
        
        paginator = Paginator(notifications, page_size)
        page_obj = paginator.get_page(page)
        
        serializer = NotificationSerializer(page_obj.object_list, many=True)
        
        return Response({
            'count': paginator.count,
            'next': page_obj.next_page_number() if page_obj.has_next() else None,
            'previous': page_obj.previous_page_number() if page_obj.has_previous() else None,
            'results': serializer.data,
        })


@method_decorator(csrf_exempt, name='dispatch')
class NotificationMarkReadView(APIView):
    """Mark a notification as read"""
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        request=OpenApiTypes.OBJECT,
        responses={200: OpenApiTypes.OBJECT},
        summary='Mark notification as read',
    )
    def patch(self, request, notification_id):
        """Mark a specific notification as read"""
        notification = NotificationService.mark_as_read(request.user, notification_id)
        
        if notification:
            serializer = NotificationSerializer(notification)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(
            {'error': 'Notification not found.'},
            status=status.HTTP_404_NOT_FOUND
        )


@method_decorator(csrf_exempt, name='dispatch')
class NotificationMarkAllReadView(APIView):
    """Mark all notifications as read"""
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses={200: OpenApiTypes.OBJECT},
        summary='Mark all notifications as read',
    )
    def post(self, request):
        """Mark all user notifications as read"""
        count = NotificationService.mark_all_as_read(request.user)
        
        return Response({
            'message': f'Marked {count} notifications as read.',
            'count': count,
        }, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class NotificationPreferenceView(generics.RetrieveUpdateAPIView):
    """Get and update user notification preferences"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationPreferenceSerializer

    @extend_schema(
        responses={200: NotificationPreferenceSerializer},
        summary='Get notification preferences',
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        request=NotificationPreferenceSerializer,
        responses={200: NotificationPreferenceSerializer},
        summary='Update notification preferences',
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    def get_object(self):
        """Get or create notification preferences for current user"""
        preferences, _ = NotificationPreference.objects.get_or_create(
            user=self.request.user,
            defaults={
                'in_app_enabled': True,
                'email_enabled': True,
            }
        )
        return preferences


@method_decorator(csrf_exempt, name='dispatch')
class NotificationStatsView(APIView):
    """Get notification statistics (unread count)"""
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses={200: OpenApiTypes.OBJECT},
        summary='Get notification statistics',
    )
    def get(self, request):
        """Get unread notification count"""
        unread_count = NotificationService.get_unread_count(request.user)
        total_count = Notification.objects.filter(user=request.user).count()
        
        return Response({
            'unread_count': unread_count,
            'total_count': total_count,
        }, status=status.HTTP_200_OK)
