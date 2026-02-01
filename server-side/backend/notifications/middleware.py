from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.conf import settings
import jwt

User = get_user_model()


@database_sync_to_async
def get_user_from_token(token_string):
    """Get user from JWT token"""
    try:
        # Validate token
        UntypedToken(token_string)
        # Decode token
        decoded_data = jwt.decode(token_string, settings.SECRET_KEY, algorithms=["HS256"])
        # Get user
        user_id = decoded_data.get('user_id')
        if user_id:
            return User.objects.get(id=user_id)
    except (InvalidToken, TokenError, jwt.DecodeError, jwt.InvalidTokenError, User.DoesNotExist):
        return None
    return None


class JWTAuthMiddleware(BaseMiddleware):
    """
    Custom middleware to authenticate WebSocket connections using JWT tokens
    """
    
    async def __call__(self, scope, receive, send):
        # Get token from query string
        query_string = scope.get('query_string', b'').decode()
        token = None
        
        # Parse query string for token
        if query_string:
            params = dict(param.split('=') for param in query_string.split('&') if '=' in param)
            token = params.get('token')
        
        # If no token in query string, try to get from headers (for wss:// connections)
        if not token:
            headers = dict(scope.get('headers', []))
            auth_header = headers.get(b'authorization', b'').decode()
            if auth_header.startswith('Bearer '):
                token = auth_header[7:]
        
        # Authenticate user
        if token:
            user = await get_user_from_token(token)
            if user:
                scope['user'] = user
            else:
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()
        
        return await super().__call__(scope, receive, send)


def JWTAuthMiddlewareStack(inner):
    """Stack JWT auth middleware"""
    return JWTAuthMiddleware(inner)
