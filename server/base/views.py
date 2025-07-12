import os
from datetime import datetime, timedelta
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.core.mail import EmailMessage, EmailMultiAlternatives
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
from .models import Todo, User, ActivityLog, PasswordResetOTP
from .serializers import (
    TodoSerializer, 
    UserRegisterSerializer, 
    UserSerializer, 
    ActivityLogSerializer,
    PasswordResetRequestSerializer,
    PasswordResetVerifySerializer
)
from django.core.paginator import Paginator, EmptyPage
from django.db.models import Q
import random

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            request.data['email'] = request.data.get('id_number', request.data.get('email'))
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.user

            if user.status != 'active':
                return Response({
                    'success': False,
                    'message': 'Your account is not active.'
                }, status=403)

            response = super().post(request, *args, **kwargs)
            tokens = response.data

            # Check if password is default
            using_default_password = user.using_default_password

            ActivityLog.objects.create(
                user=user,
                action='login',
                details={
                    'ip_address': self._get_client_ip(request),
                    'using_default_password': using_default_password
                }
            )

            res = Response({
                'success': True,
                'using_default_password': using_default_password
            })
            res.set_cookie(
                key='access_token',
                value=tokens['access'],
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            res.set_cookie(
                key='refresh_token',
                value=tokens['refresh'],
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            return res

        except AuthenticationFailed:
            return Response({
                'success': False,
                'message': 'Invalid email or password.'
            }, status=400)

        except Exception as e:
            print(e)
            return Response({
                'success': False,
                'message': 'Please try again later.'
            }, status=400)

    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

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
        # Don't reveal if user exists for security
        return Response({
            'success': True,
            'message': 'If this email exists in our system, you will receive a password reset OTP'
        })

    # Invalidate any existing OTPs
    PasswordResetOTP.objects.filter(user=user).update(is_used=True)

    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    expires_at = timezone.now() + timedelta(minutes=15)

    # Create new OTP record
    PasswordResetOTP.objects.create(
        user=user,
        otp=otp,
        expires_at=expires_at
    )

    # Prepare email context
    context = {
        'user': user,
        'otp_code': otp,
        'expiry_minutes': 15,
        'reset_url': settings.FRONTEND_RESET_URL,
        'support_email': settings.SUPPORT_EMAIL,
        'system_name': settings.SYSTEM_NAME
    }

    # Render email templates
    subject = f"Password Reset OTP for {context['system_name']}"
    html_message = render_to_string('email/password_reset_otp.html', context)
    text_message = strip_tags(html_message)

    # Create and send email
    try:
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
            reply_to=[settings.SUPPORT_EMAIL]
        )
        email.attach_alternative(html_message, "text/html")
        email.send(fail_silently=False)

        # Log OTP sent
        ActivityLog.objects.create(
            user=user,
            action='otp_sent',
            details={
                'email': user.email,
                'ip_address': request.META.get('REMOTE_ADDR'),
                'otp_masked': f"{otp[:2]}****{otp[-2:]}"  # Log masked OTP for security
            }
        )

        return Response({
            'success': True,
            'message': 'If this email exists in our system, you will receive a password reset OTP'
        })
    
    except Exception as e:
        # Detailed error logging
        error_msg = f"Failed to send OTP email to {user.email}: {str(e)}"
        print(error_msg)
        
        # Log the email failure
        ActivityLog.objects.create(
            user=user,
            action='otp_send_failed',
            details={
                'email': user.email,
                'error': str(e),
                'ip_address': request.META.get('REMOTE_ADDR')
            }
        )

        return Response({
            'success': False,
            'message': 'Failed to send OTP email. Please try again later.',
            'error': str(e) if settings.DEBUG else None
        }, status=500)

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
        
        # Password validation
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

        return Response({
            'success': True,
            'message': 'Password reset successfully'
        })

    except Exception as e:
        return Response({
            'success': False,
            'message': 'An error occurred',
            'error': str(e)
        }, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_logged_in(request):
    if request.user.status != 'active':
        return Response({
            'success': False,
            'message': 'Your account is not active'
        }, status=403)

    serializer = UserSerializer(request.user)
    return Response({
        **serializer.data,
        'using_default_password': request.user.using_default_password
    })

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)

            res = Response({'refreshed': True})
            res.set_cookie(
                key='access_token',
                value=response.data['access'],
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            return res
        except Exception as e:
            print(e)
            return Response({'refreshed': False}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        ActivityLog.objects.create(
            user=request.user,
            action='logout'
        )

        res = Response({'success': True})
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/', samesite='None')
        return res
    except Exception as e:
        print(e)
        return Response({'success': False}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register(request):
    if request.user.user_level != 'administrator':
        return Response({
            'success': False,
            'message': 'Only admin users can create new accounts'
        }, status=403) 

    if User.objects.filter(email=request.data.get('email')).exists():
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

            # Send account creation email
            subject = 'Your IERMS Account Has Been Created'
            html_message = render_to_string('email/account_created.html', {
                'user': user,
                'admin': request.user,
                'default_password': settings.DEFAULT_USER_PASSWORD,
                'login_url': settings.FRONTEND_LOGIN_URL
            })
            plain_message = strip_tags(html_message)
            
            try:
                # Use EmailMessage for better control
                email = EmailMessage(
                    subject,
                    plain_message,
                    settings.EMAIL_HOST_USER,
                    [user.email],
                )
                email.content_subtype = "html"
                email.body = html_message
                email.send(fail_silently=False)
            except Exception as e:
                print(f"Error sending account creation email: {e}")
                # Don't fail the request if email fails
            
            return Response({
                'success': True,
                'message': 'Registration successful',
                'user': UserSerializer(user).data
            }, status=201)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'User creation failed',
                'error': str(e)
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
    
    ActivityLog.objects.create(
        admin=request.user,
        user=user,
        action='user_deleted',
        details={
            'email': user.email,
            'user_level': user.user_level
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
    
    if 'email' in request.data:
        email = request.data['email']
        if User.objects.filter(email=email).exclude(pk=user.pk).exists():
            return Response({
                'success': False,
                'message': 'Validation failed',
                'errors': {
                    'email': ['A user with this email already exists.']
                }
            }, status=400)
    
    serializer = UserSerializer(user, data=request.data, partial=True)
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
        'user': UserSerializer(user).data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    if request.user.user_level != 'administrator':
        raise PermissionDenied("Only admin users can view the user list")

    queryset = User.objects.exclude(id=request.user.id)

    if status := request.query_params.get('status'):
        queryset = queryset.filter(status=status)

    if user_level := request.query_params.get('user_level'):
        queryset = queryset.filter(user_level=user_level)

    queryset = queryset.order_by('email')
    serializer = UserSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_reset_password(request):
    """
    Allows admin users to reset another user's password to system default
    Requires admin password verification for security
    """
    # Validate admin permissions
    if request.user.user_level != 'administrator':
        return Response({
            'success': False,
            'message': 'Only administrator users can reset passwords',
            'code': 'permission_denied'
        }, status=403)

    # Validate request data
    admin_password = request.data.get('admin_password')
    email = request.data.get('email')

    if not admin_password:
        return Response({
            'success': False,
            'message': 'Admin password verification is required',
            'code': 'admin_password_required'
        }, status=400)

    if not email:
        return Response({
            'success': False,
            'message': 'User email is required',
            'code': 'email_required'
        }, status=400)

    # Verify admin password
    if not request.user.check_password(admin_password):
        ActivityLog.objects.create(
            admin=request.user,
            action='admin_password_verification_failed',
            details={
                'attempted_action': 'password_reset',
                'target_email': email
            }
        )
        return Response({
            'success': False,
            'message': 'Admin password is incorrect',
            'code': 'invalid_admin_password'
        }, status=400)

    # Get target user
    try:
        user = User.objects.get(email__iexact=email.lower())
    except User.DoesNotExist:
        ActivityLog.objects.create(
            admin=request.user,
            action='password_reset_attempt_failed',
            details={
                'reason': 'user_not_found',
                'target_email': email
            }
        )
        return Response({
            'success': False,
            'message': 'User not found with this email',
            'code': 'user_not_found'
        }, status=404)

    # Check if user is active
    if user.status != 'active':
        ActivityLog.objects.create(
            admin=request.user,
            action='password_reset_attempt_failed',
            details={
                'reason': 'user_inactive',
                'target_email': email,
                'user_status': user.status
            }
        )
        return Response({
            'success': False,
            'message': 'Cannot reset password for inactive user',
            'code': 'user_inactive'
        }, status=400)

    # Reset password to default
    default_password = settings.DEFAULT_USER_PASSWORD
    user.set_password(default_password)
    user.save()

    # Log the password reset
    ActivityLog.objects.create(
        admin=request.user,
        user=user,
        action='password_reset',
        details={
            'reset_by_admin': True,
            'reset_to_default': True,
            'target_email': user.email,
            'target_name': f"{user.first_name} {user.last_name}"
        }
    )

    # Send email notification
    email_sent = False
    email_error = None
    
    try:
        context = {
            'user': user,
            'admin': request.user,
            'default_password': default_password,
            'login_url': settings.FRONTEND_LOGIN_URL,
            'system_name': settings.SYSTEM_NAME,
            'support_email': settings.SUPPORT_EMAIL,
            'reset_time': timezone.now().strftime('%Y-%m-%d %H:%M:%S')
        }

        subject = f"{settings.SYSTEM_NAME} Password Reset Notification"
        html_message = render_to_string('email/password_reset_by_admin.html', context)
        text_message = strip_tags(html_message)

        email = EmailMultiAlternatives(
            subject=subject,
            body=text_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
            reply_to=[settings.SUPPORT_EMAIL]
        )
        email.attach_alternative(html_message, "text/html")
        email.send(fail_silently=False)
        
        email_sent = True
        ActivityLog.objects.create(
            user=user,
            action='password_reset_email_sent',
            details={'email': user.email}
        )
        
    except Exception as e:
        email_error = str(e)
        ActivityLog.objects.create(
            user=user,
            action='password_reset_email_failed',
            details={
                'email': user.email,
                'error': email_error
            }
        )
        print(f"Failed to send password reset email: {email_error}")

    # Return success response
    response_data = {
        'success': True,
        'message': 'Password has been reset to system default',
        'user': {
            'id': user.id,
            'email': user.email,
            'full_name': f"{user.first_name} {user.last_name}",
            'status': user.status,
            'using_default_password': True
        },
        'email_notification': {
            'sent': email_sent,
            'error': email_error
        }
    }

    return Response(response_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_profile(request):
    serializer = UserSerializer(request.user, context={'request': request})
    return Response({
        **serializer.data,
        'using_default_password': request.user.using_default_password
    })

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    data = request.data.copy()
    
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
        
        user.set_password(data['new_password'])
        user.save()
    
    # Handle other profile updates
    serializer = UserSerializer(user, data=data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        
        ActivityLog.objects.create(
            user=user,
            action='profile_updated',
            details={
                'changes': data
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

    # Delete old avatar if it exists and isn't the default
    if user.avatar and user.avatar.name != 'avatars/default.jpg':
        try:
            storage = user.avatar.storage
            storage.delete(user.avatar.name)
        except Exception as e:
            print(f"Error deleting old avatar: {e}")

    user.avatar = avatar
    user.save()

    ActivityLog.objects.create(
        user=user,
        action='avatar_updated',
        details={
            'avatar_file': avatar.name
        }
    )

    # Get updated avatar URL with timestamp for cache busting
    avatar_url = request.build_absolute_uri(user.avatar.url)
    timestamp = int(datetime.now().timestamp())
    avatar_url = f"{avatar_url.split('?')[0]}?t={timestamp}"

    return Response({
        'success': True,
        'message': 'Avatar updated successfully',
        'avatar_url': avatar_url  # Make sure this is included
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_todos(request):
    todos = Todo.objects.filter(owner=request.user)
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
    
    action = request.query_params.get('action')
    user_id = request.query_params.get('user_id')
    admin_id = request.query_params.get('admin_id')
    search = request.query_params.get('search')
    
    logs = ActivityLog.objects.all().order_by('-created_at')
    
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
    
    page = request.query_params.get('page', 1)
    page_size = request.query_params.get('page_size', 20)
    paginator = Paginator(logs, page_size)
    
    try:
        paginated_logs = paginator.page(page)
    except EmptyPage:
        paginated_logs = paginator.page(paginator.num_pages)
    
    serializer = ActivityLogSerializer(paginated_logs, many=True)
    
    return Response({
        'results': serializer.data,
        'count': paginator.count,
        'total_pages': paginator.num_pages,
        'current_page': paginated_logs.number
    })