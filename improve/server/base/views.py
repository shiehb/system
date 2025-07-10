import os
from datetime import datetime, timedelta
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils import timezone
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from .models import Todo, User, ActivityLog, PasswordResetOTP
from .serializers import (
    TodoSerializer, 
    UserRegisterSerializer, 
    UserSerializer, 
    ActivityLogSerializer,
    PasswordResetRequestSerializer,
    PasswordResetVerifySerializer,
    CustomTokenObtainPairSerializer
)
from django.core.paginator import Paginator, EmptyPage
from django.db.models import Q
import random
import logging

logger = logging.getLogger(__name__)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        try:
            # Handle both email and id_number fields
            email = request.data.get('email') or request.data.get('id_number')
            if not email:
                return Response({
                    'success': False,
                    'message': 'Email is required.'
                }, status=400)
            
            # Create a mutable copy of the data
            data = request.data.copy()
            data['email'] = email.lower().strip()
            
            serializer = self.get_serializer(data=data, context={'request': request})
            
            try:
                serializer.is_valid(raise_exception=True)
            except Exception as e:
                logger.error(f"Serializer validation error: {e}")
                return Response({
                    'success': False,
                    'message': 'Invalid email or password.'
                }, status=400)
            
            user = serializer.user

            if user.status != 'active':
                return Response({
                    'success': False,
                    'message': 'Your account is not active.'
                }, status=403)

            # Get tokens manually
            refresh = RefreshToken.for_user(user)
            tokens = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }

            # Check if password is default
            using_default_password = user.using_default_password

            ActivityLog.objects.create(
                user=user,
                action='login',
                details={
                    'ip_address': self._get_client_ip(request),
                    'using_default_password': using_default_password,
                    'user_agent': request.META.get('HTTP_USER_AGENT', '')
                }
            )

            res = Response({
                'success': True, 
                'using_default_password': using_default_password,
                'user': UserSerializer(user, context={'request': request}).data
            })
            
            # Dynamic cookie security based on environment
            cookie_secure = self._should_use_secure_cookies()
            cookie_domain = self._get_cookie_domain(request)
            
            # Set access token cookie
            res.set_cookie(
                key='access_token',
                value=tokens['access'],
                max_age=int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()),
                httponly=True,
                secure=cookie_secure,
                samesite='Lax',
                domain=cookie_domain,
                path='/'
            )
            
            # Set refresh token cookie
            res.set_cookie(
                key='refresh_token',
                value=tokens['refresh'],
                max_age=int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()),
                httponly=True,
                secure=cookie_secure,
                samesite='Lax',
                domain=cookie_domain,
                path='/'
            )
            
            return res

        except AuthenticationFailed as e:
            logger.error(f"Authentication failed: {e}")
            return Response({
                'success': False,
                'message': 'Invalid email or password.'
            }, status=400)

        except Exception as e:
            logger.error(f"Login error: {e}")
            import traceback
            traceback.print_exc()
            return Response({
                'success': False,
                'message': 'Please try again later.'
            }, status=500)

    def _get_client_ip(self, request):
        """Extract client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def _should_use_secure_cookies(self):
        """Determine if cookies should be secure based on environment"""
        return not settings.DEBUG and getattr(settings, 'FORCE_HTTPS', False)

    def _get_cookie_domain(self, request):
        """Get appropriate cookie domain"""
        if settings.DEBUG:
            return None  # Let browser handle domain for localhost
        return getattr(settings, 'COOKIE_DOMAIN', None)

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if not refresh_token:
                logger.warning("Refresh token not found in cookies")
                return Response({
                    'refreshed': False,
                    'message': 'Refresh token not found in cookies'
                }, status=400)
            
            # Use the refresh token to get a new access token
            try:
                refresh = RefreshToken(refresh_token)
                
                # Check if the user still exists and is active
                user_id = refresh.payload.get('user_id')
                if user_id:
                    try:
                        user = User.objects.get(id=user_id)
                        if not user.is_active or user.status != 'active':
                            logger.warning(f"Inactive user attempted token refresh: {user.email}")
                            return Response({
                                'refreshed': False,
                                'message': 'User account is not active'
                            }, status=403)
                    except User.DoesNotExist:
                        logger.warning(f"User not found for token refresh: {user_id}")
                        return Response({
                            'refreshed': False,
                            'message': 'User not found'
                        }, status=404)
                
                new_access_token = str(refresh.access_token)
                
            except (InvalidToken, TokenError) as token_error:
                logger.error(f"Token validation error: {token_error}")
                return Response({
                    'refreshed': False,
                    'message': 'Invalid refresh token'
                }, status=400)
        
            res = Response({'refreshed': True})
        
            # Dynamic cookie security based on environment
            cookie_secure = self._should_use_secure_cookies()
            cookie_domain = self._get_cookie_domain(request)
        
            res.set_cookie(
                key='access_token',
                value=new_access_token,
                max_age=int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()),
                httponly=True,
                secure=cookie_secure,
                samesite='Lax',
                domain=cookie_domain,
                path='/'
            )
            return res
            
        except Exception as e:
            logger.error(f"Token refresh error: {e}")
            import traceback
            traceback.print_exc()
            return Response({
                'refreshed': False,
                'message': 'Token refresh failed'
            }, status=400)

    def _should_use_secure_cookies(self):
        """Determine if cookies should be secure based on environment"""
        return not settings.DEBUG and getattr(settings, 'FORCE_HTTPS', False)

    def _get_cookie_domain(self, request):
        """Get appropriate cookie domain"""
        if settings.DEBUG:
            return None
        return getattr(settings, 'COOKIE_DOMAIN', None)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        # Get refresh token from cookies
        refresh_token = request.COOKIES.get('refresh_token')
        
        # Try to blacklist the refresh token if it exists
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception as e:
                logger.warning(f"Could not blacklist token: {e}")

        ActivityLog.objects.create(
            user=request.user,
            action='logout',
            details={
                'ip_address': request.META.get('REMOTE_ADDR'),
                'user_agent': request.META.get('HTTP_USER_AGENT', '')
            }
        )

        res = Response({'success': True})
        
        # Clear cookies with appropriate settings
        cookie_secure = not settings.DEBUG and getattr(settings, 'FORCE_HTTPS', False)
        cookie_domain = None if settings.DEBUG else getattr(settings, 'COOKIE_DOMAIN', None)
        
        res.delete_cookie(
            'access_token', 
            path='/',
            domain=cookie_domain,
            secure=cookie_secure,
            samesite='Lax'
        )
        res.delete_cookie(
            'refresh_token', 
            path='/',
            domain=cookie_domain,
            secure=cookie_secure,
            samesite='Lax'
        )
        return res
    except Exception as e:
        logger.error(f"Logout error: {e}")
        return Response({'success': False}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    serializer = PasswordResetRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Invalid email address',
            'errors': serializer.errors
        }, status=400)

    email = serializer.validated_data['email'].lower()
    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        return Response({
            'success': True,
            'message': 'If this email exists in our system, you will receive a password reset OTP'
        })

    # Invalidate any existing OTPs for this user
    PasswordResetOTP.objects.filter(user=user).update(is_used=True)

    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    expires_at = timezone.now() + timedelta(minutes=getattr(settings, 'PASSWORD_RESET_OTP_EXPIRE_MINUTES', 15))

    # Create new OTP record
    PasswordResetOTP.objects.create(
        user=user,
        otp=otp,
        expires_at=expires_at
    )

    # Send email with OTP
    subject = 'Password Reset OTP'
    try:
        html_message = render_to_string('email/password_reset_otp.html', {
            'user': user,
            'otp': otp,
            'expires_in': getattr(settings, 'PASSWORD_RESET_OTP_EXPIRE_MINUTES', 15)
        })
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            html_message=html_message,
            fail_silently=False
        )
    except Exception as e:
        logger.error(f"Error sending password reset email: {e}")
        return Response({
            'success': False,
            'message': 'Failed to send OTP. Please try again later.'
        }, status=500)

    # Log OTP sent
    ActivityLog.objects.create(
        user=user,
        action='otp_sent',
        details={
            'email': user.email,
            'ip_address': request.META.get('REMOTE_ADDR')
        }
    )

    return Response({
        'success': True,
        'message': 'If this email exists in our system, you will receive a password reset OTP'
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_password_reset(request):
    serializer = PasswordResetVerifySerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=400)

    try:
        user = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        new_password = serializer.validated_data['new_password']
        
        # Additional password validation
        if len(new_password) < 8:
            return Response({
                'success': False,
                'message': 'Password must be at least 8 characters'
            }, status=400)

        # OTP validation
        otp_record = PasswordResetOTP.objects.filter(
            user=user,
            otp=otp,
            is_used=False,
            expires_at__gt=timezone.now()
        ).first()

        if not otp_record:
            return Response({
                'success': False,
                'message': 'Invalid or expired OTP'
            }, status=400)

        # Update password
        user.set_password(new_password)
        user.save()

        # Invalidate OTP
        otp_record.is_used = True
        otp_record.save()

        # Log successful password reset
        ActivityLog.objects.create(
            user=user,
            action='password_reset_success',
            details={
                'email': user.email,
                'ip_address': request.META.get('REMOTE_ADDR'),
                'reset_method': 'otp'
            }
        )

        return Response({
            'success': True,
            'message': 'Password reset successfully'
        })

    except Exception as e:
        logger.error(f"Password reset verification error: {e}")
        return Response({
            'success': False,
            'message': 'An error occurred during password reset',
            'error': str(e) if settings.DEBUG else 'Internal server error'
        }, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_logged_in(request):
    try:
        if request.user.status != 'active':
            return Response({
                'success': False,
                'message': 'Your account is not active'
            }, status=403)

        serializer = UserSerializer(request.user, context={'request': request})
        return Response({
            **serializer.data,
            'using_default_password': request.user.using_default_password
        })
    except Exception as e:
        logger.error(f"is_logged_in error: {e}")
        return Response({
            'success': False,
            'message': 'Authentication failed'
        }, status=401)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register(request):
    if request.user.user_level != 'administrator':
        return Response({
            'success': False,
            'message': 'Only admin users can create new accounts'
        }, status=403) 

    # Check for existing email
    email = request.data.get('email', '').lower()
    if User.objects.filter(email__iexact=email).exists():
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': {
                'email': ['A user with this email already exists.']
            }
        }, status=400)

    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            
            ActivityLog.objects.create(
                admin=request.user,
                user=user,
                action='user_created',
                details={
                    'email': user.email,
                    'user_level': user.user_level,
                    'status': user.status,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            )

            return Response({
                'success': True,
                'message': 'Registration successful',
                'user': UserSerializer(user, context={'request': request}).data
            }, status=201)
        except Exception as e:
            logger.error(f"User creation error: {e}")
            return Response({
                'success': False,
                'message': 'User creation failed',
                'error': str(e) if settings.DEBUG else 'Internal server error'
            }, status=400)
    
    return Response({
        'success': False,
        'message': 'Validation failed',
        'errors': serializer.errors
    }, status=400)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, pk):
    if request.user.user_level != 'administrator':
        return Response({
            'success': False,
            'message': 'Only admin users can delete accounts'
        }, status=403)
    
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found'
        }, status=404)
    
    # Prevent self-deletion
    if user.id == request.user.id:
        return Response({
            'success': False,
            'message': 'You cannot delete your own account'
        }, status=400)
    
    ActivityLog.objects.create(
        admin=request.user,
        user=user,
        action='user_deleted',
        details={
            'email': user.email,
            'user_level': user.user_level,
            'full_name': f"{user.first_name} {user.last_name}"
        }
    )
    
    user.delete()
    
    return Response({
        'success': True,
        'message': 'User deleted successfully'
    })

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user(request, pk):
    if request.user.user_level != 'administrator':
        return Response({
            'success': False,
            'message': 'Only admin users can update users'
        }, status=403)
    
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found'
        }, status=404)
    
    original_data = {
        'email': user.email,
        'user_level': user.user_level,
        'status': user.status,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'middle_name': user.middle_name
    }
    
    # Check for email conflicts
    if 'email' in request.data:
        email = request.data['email'].lower()
        if User.objects.filter(email__iexact=email).exclude(pk=user.pk).exists():
            return Response({
                'success': False,
                'message': 'Validation failed',
                'errors': {
                    'email': ['A user with this email already exists.']
                }
            }, status=400)
    
    serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        
        updated_user = User.objects.get(pk=pk)
        updated_data = {
            'email': updated_user.email,
            'user_level': updated_user.user_level,
            'status': updated_user.status,
            'first_name': updated_user.first_name,
            'last_name': updated_user.last_name,
            'middle_name': updated_user.middle_name
        }
        
        changes = {}
        for field in ['email', 'user_level', 'status', 'first_name', 'last_name', 'middle_name']:
            if original_data[field] != updated_data[field]:
                changes[field] = {
                    'from': original_data[field],
                    'to': updated_data[field]
                }
        
        if changes:
            ActivityLog.objects.create(
                admin=request.user,
                user=user,
                action='user_updated',
                details={
                    'changes': changes
                }
            )
        
        return Response({
            'success': True,
            'message': 'User updated successfully',
            'user': serializer.data
        })
    
    return Response({
        'success': False,
        'message': 'Validation failed',
        'errors': serializer.errors
    }, status=400)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def change_user_status(request, pk):
    if request.user.user_level != 'administrator':
        return Response({
            'success': False,
            'message': 'Only admin users can change user status'
        }, status=403)
    
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found'
        }, status=404)
    
    # Prevent changing own status
    if user.id == request.user.id:
        return Response({
            'success': False,
            'message': 'You cannot change your own status'
        }, status=400)
    
    status = request.data.get('status')
    if not status or status not in dict(User.STATUS_CHOICES).keys():
        return Response({
            'success': False,
            'message': 'Invalid status value'
        }, status=400)
    
    original_status = user.status
    user.status = status
    user.save()
    
    ActivityLog.objects.create(
        admin=request.user,
        user=user,
        action='status_changed',
        details={
            'from': original_status,
            'to': status,
            'email': user.email,
            'full_name': f"{user.first_name} {user.last_name}"
        }
    )
    
    return Response({
        'success': True,
        'message': 'User status updated successfully',
        'user': UserSerializer(user, context={'request': request}).data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    if request.user.user_level != 'administrator':
        raise PermissionDenied("Only admin users can view the user list")

    queryset = User.objects.exclude(id=request.user.id)

    # Apply filters
    if status := request.query_params.get('status'):
        queryset = queryset.filter(status=status)

    if user_level := request.query_params.get('user_level'):
        queryset = queryset.filter(user_level=user_level)

    if search := request.query_params.get('search'):
        queryset = queryset.filter(
            Q(email__icontains=search) |
            Q(first_name__icontains=search) |
            Q(last_name__icontains=search)
        )

    queryset = queryset.order_by('email')
    serializer = UserSerializer(queryset, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_reset_password(request):
    if request.user.user_level != 'administrator':
        return Response({
            'success': False,
            'message': 'Only admin users can reset passwords'
        }, status=403)

    admin_password = request.data.get('admin_password')
    if not admin_password or not request.user.check_password(admin_password):
        return Response({
            'success': False,
            'message': 'Admin password is incorrect'
        }, status=400)

    email = request.data.get('email', '').lower()
    if not email:
        return Response({
            'success': False,
            'message': 'Email is required'
        }, status=400)

    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found with this email'
        }, status=404)

    user.set_password(settings.DEFAULT_USER_PASSWORD)
    user.save()

    ActivityLog.objects.create(
        admin=request.user,
        user=user,
        action='password_reset',
        details={
            'email': user.email,
            'full_name': f"{user.first_name} {user.last_name}",
            'reset_to_default': True
        }
    )

    return Response({
        'success': True,
        'message': 'Password reset successfully to default',
        'user': {
            'email': user.email,
            'full_name': f"{user.first_name} {user.last_name}"
        }
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_profile(request):
    try:
        serializer = UserSerializer(request.user, context={'request': request})
        return Response({
            **serializer.data,
            'using_default_password': request.user.using_default_password
        })
    except Exception as e:
        logger.error(f"get_my_profile error: {e}")
        return Response({
            'success': False,
            'message': 'Failed to get profile'
        }, status=500)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    data = request.data.copy()
    
    # Handle password change
    if 'new_password' in data and data['new_password']:
        if 'current_password' not in data or not data['current_password']:
            return Response({
                'success': False,
                'message': 'Current password is required'
            }, status=400)
        
        if not user.check_password(data['current_password']):
            return Response({
                'success': False,
                'message': 'Current password is incorrect'
            }, status=400)
        
        if len(data['new_password']) < 8:
            return Response({
                'success': False,
                'message': 'New password must be at least 8 characters'
            }, status=400)
        
        user.set_password(data['new_password'])
        user.save()
        
        # Remove password fields from data to avoid serializer issues
        data.pop('current_password', None)
        data.pop('new_password', None)
    
    # Handle other profile updates
    serializer = UserSerializer(user, data=data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        
        ActivityLog.objects.create(
            user=user,
            action='profile_updated',
            details={
                'changes': list(data.keys())
            }
        )
        
        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'user': serializer.data
        })
    
    return Response({
        'success': False,
        'message': 'Validation failed',
        'errors': serializer.errors
    }, status=400)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_avatar(request):
    user = request.user
    avatar = request.FILES.get('avatar')

    if not avatar:
        return Response({
            'success': False,
            'message': 'No avatar file provided'
        }, status=400)

    # Validate file size (5MB limit)
    if avatar.size > 5 * 1024 * 1024:
        return Response({
            'success': False,
            'message': 'Avatar file size must be less than 5MB'
        }, status=400)

    # Validate file type
    allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    if avatar.content_type not in allowed_types:
        return Response({
            'success': False,
            'message': 'Avatar must be a JPEG, PNG, or GIF image'
        }, status=400)

    # Delete old avatar if it's not the default
    if user.avatar and user.avatar.name != 'avatars/default.jpg':
        try:
            storage = user.avatar.storage
            if storage.exists(user.avatar.name):
                storage.delete(user.avatar.name)
        except Exception as e:
            logger.error(f"Error deleting old avatar: {e}")

    user.avatar = avatar
    user.save()

    ActivityLog.objects.create(
        user=user,
        action='avatar_updated',
        details={
            'avatar_file': avatar.name,
            'file_size': avatar.size
        }
    )

    # Get updated timestamp for cache busting
    timestamp = int(datetime.now().timestamp())
    serializer = UserSerializer(user, context={'request': request})
    avatar_url = serializer.data.get('avatar_url', '')
    if avatar_url:
        avatar_url = f"{avatar_url.split('?')[0]}?t={timestamp}"

    return Response({
        'success': True,
        'message': 'Avatar updated successfully',
        'avatar_url': avatar_url
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_todos(request):
    todos = Todo.objects.filter(owner=request.user).order_by('-id')
    serializer = TodoSerializer(todos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_activity_logs(request):
    if request.user.user_level != 'administrator':
        return Response({
            'success': False,
            'message': 'Only admin users can view activity logs'
        }, status=403)
    
    # Get filter parameters
    action = request.query_params.get('action')
    user_id = request.query_params.get('user_id')
    admin_id = request.query_params.get('admin_id')
    search = request.query_params.get('search')
    
    logs = ActivityLog.objects.all().order_by('-created_at')
    
    # Apply filters
    if action:
        logs = logs.filter(action=action)
    if user_id:
        logs = logs.filter(user__id=user_id)
    if admin_id:
        logs = logs.filter(admin__id=admin_id)
    if search:
        logs = logs.filter(
            Q(user__email__icontains=search) |
            Q(user__first_name__icontains=search) |
            Q(user__last_name__icontains=search) |
            Q(admin__email__icontains=search) |
            Q(admin__first_name__icontains=search) |
            Q(admin__last_name__icontains=search) |
            Q(details__icontains=search)
        )
    
    # Pagination
    page = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('page_size', 20))
    paginator = Paginator(logs, page_size)
    
    try:
        paginated_logs = paginator.page(page)
    except EmptyPage:
        paginated_logs = paginator.page(paginator.num_pages)
    
    serializer = ActivityLogSerializer(paginated_logs, many=True, context={'request': request})
    
    return Response({
        'results': serializer.data,
        'count': paginator.count,
        'total_pages': paginator.num_pages,
        'current_page': paginated_logs.number,
        'has_next': paginated_logs.has_next(),
        'has_previous': paginated_logs.has_previous()
    })

