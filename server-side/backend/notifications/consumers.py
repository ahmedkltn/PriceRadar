import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Notification
from .services import NotificationService


class NotificationConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for real-time notifications"""

    async def connect(self):
        """Handle WebSocket connection"""
        # Check if user is authenticated
        if self.scope['user'].is_anonymous:
            await self.close()
            return
        
        self.user = self.scope['user']
        self.room_group_name = f"user_{self.user.id}"
        
        # Join user's notification group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send unread count on connection
        unread_count = await database_sync_to_async(NotificationService.get_unread_count)(self.user)
        await self.send(text_data=json.dumps({
            'type': 'connection',
            'unread_count': unread_count,
        }))

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        if hasattr(self, 'room_group_name'):
            # Leave user's notification group
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        """Handle messages received from WebSocket"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'mark_read':
                # Mark notification as read
                notification_id = data.get('notification_id')
                if notification_id:
                    await database_sync_to_async(NotificationService.mark_as_read)(
                        self.user,
                        notification_id
                    )
                    # Send confirmation
                    await self.send(text_data=json.dumps({
                        'type': 'mark_read_success',
                        'notification_id': notification_id,
                    }))
            
            elif message_type == 'get_unread_count':
                # Get unread count
                unread_count = await database_sync_to_async(NotificationService.get_unread_count)(self.user)
                await self.send(text_data=json.dumps({
                    'type': 'unread_count',
                    'count': unread_count,
                }))
        except json.JSONDecodeError:
            pass

    async def notification_message(self, event):
        """Send notification to WebSocket"""
        notification = event['notification']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'notification': notification,
        }))
