from .models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class CookiesJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Try to get token from cookie first
        access_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
        
        # If no token in cookies, check Authorization header
        if not access_token:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                access_token = auth_header.split(' ')[1]
            else:
                return None

        try:
            # Validate token and get user
            validated_token = self.get_validated_token(access_token)
            user = self.get_user(validated_token)
            
            # Additional check for user status
            if not user.is_active:
                raise AuthenticationFailed('User is inactive', code='user_inactive')
                
            return (user, validated_token)
            
        except (InvalidToken, TokenError) as e:
            # Handle specific JWT errors
            raise AuthenticationFailed('Invalid token', code='invalid_token')
        except AuthenticationFailed as e:
            # Re-raise authentication failures
            raise
        except Exception as e:
            # Catch any other unexpected errors
            raise AuthenticationFailed('Authentication failed', code='authentication_failed')