import os
from datetime import datetime
from django.conf import settings

from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import Todo, User, ActivityLog
from .serializers import TodoSerializer, UserRegisterSerializer, UserSerializer, ActivityLogSerializer
from .utils import log_admin_action

from django.core.paginator import Paginator, EmptyPage
from django.db.models import Q

# --- Login ---
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
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

            # Log successful login
            ActivityLog.objects.create(
                user=user,
                action='login',
                details={
                    'ip_address': self._get_client_ip(request)
                }
            )

            res = Response({'success': True})
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
                'message': 'Invalid ID number or password.'
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

# --- Check Login Status ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_logged_in(request):
    if request.user.status != 'active':
        return Response({
            'success': False,
            'message': 'Your account is not active'
        }, status=403)

    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# --- Token Refresh ---
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

# --- Logout ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        # Log logout action
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

# --- Register New User ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Admin only
def register(request):
    if request.user.user_level != 'admin':
        return Response({
            'success': False,
            'message': 'Only admin users can create new accounts'
        }, status=403) 

    # Check for duplicate ID number
    if User.objects.filter(id_number=request.data.get('id_number')).exists():
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': {
                'id_number': ['A user with this ID number already exists.']
            }
        }, status=400)
    
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
            
            # Enhanced logging with more details
            ActivityLog.objects.create(
                admin=request.user,
                user=user,
                action='user_created',
                details={
                    'id_number': user.id_number,
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

# --- Delete User (Admin only) ---
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, pk):
    if request.user.user_level != 'admin':
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
    
    # Log before deletion
    ActivityLog.objects.create(
        admin=request.user,
        user=user,
        action='user_deleted',
        details={
            'id_number': user.id_number,
            'email': user.email,
            'user_level': user.user_level
        }
    )
    
    user.delete()
    
    return Response({
        'success': True,
        'message': 'User deleted successfully'
    })

# --- Update User (Admin only) ---
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user(request, pk):
    if request.user.user_level != 'admin':
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
    
    # Store original data for logging
    original_data = {
        'id_number': user.id_number,
        'email': user.email,
        'user_level': user.user_level,
        'status': user.status,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'middle_name': user.middle_name
    }
    
    # Check for duplicate ID number (excluding current user)
    if 'id_number' in request.data:
        id_number = request.data['id_number']
        if User.objects.filter(id_number=id_number).exclude(pk=user.pk).exists():
            return Response({
                'success': False,
                'message': 'Validation failed',
                'errors': {
                    'id_number': ['A user with this ID number already exists.']
                }
            }, status=400)
    
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
        
        # Get updated data
        updated_user = User.objects.get(pk=pk)
        updated_data = {
            'id_number': updated_user.id_number,
            'email': updated_user.email,
            'user_level': updated_user.user_level,
            'status': updated_user.status,
            'first_name': updated_user.first_name,
            'last_name': updated_user.last_name,
            'middle_name': updated_user.middle_name
        }
        
        # Determine what changed
        changes = {}
        for field in ['id_number', 'email', 'user_level', 'status', 'first_name', 'last_name', 'middle_name']:
            if original_data[field] != updated_data[field]:
                changes[field] = {
                    'from': original_data[field],
                    'to': updated_data[field]
                }
        
        # Log the user update action if anything changed
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

# --- Change User Status (Admin only) ---
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def change_user_status(request, pk):
    if request.user.user_level != 'admin':
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
    
    # Enhanced status change logging
    ActivityLog.objects.create(
        admin=request.user,
        user=user,
        action='status_changed',
        details={
            'from': original_status,
            'to': status,
            'id_number': user.id_number,
            'full_name': f"{user.first_name} {user.last_name}"
        }
    )
    
    return Response({
        'success': True,
        'message': 'User status updated successfully',
        'user': UserSerializer(user).data
    })

# --- Get All Users (Admin only) ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    if request.user.user_level != 'admin':
        raise PermissionDenied("Only admin users can view the user list")

    queryset = User.objects.exclude(id=request.user.id)

    if status := request.query_params.get('status'):
        queryset = queryset.filter(status=status)

    if user_level := request.query_params.get('user_level'):
        queryset = queryset.filter(user_level=user_level)

    queryset = queryset.order_by('id_number')
    serializer = UserSerializer(queryset, many=True)
    return Response(serializer.data)

# --- Reset Password (Admin only) ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_reset_password(request):
    # Verify admin status
    if request.user.user_level != 'admin':
        return Response({
            'success': False,
            'message': 'Only admin users can reset passwords'
        }, status=403)

    # Verify admin password
    admin_password = request.data.get('admin_password')
    if not admin_password or not request.user.check_password(admin_password):
        return Response({
            'success': False,
            'message': 'Admin password is incorrect'
        }, status=400)

    # Get target user using id_number
    id_number = request.data.get('id_number')

    if not id_number:
        return Response({
            'success': False,
            'message': 'ID Number is required'
        }, status=400)

    try:
        user = User.objects.get(id_number=id_number)
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found with this ID number'
        }, status=404)

    # Reset password to default
    user.set_password(settings.DEFAULT_USER_PASSWORD)
    user.save()

    # Enhanced password reset logging
    ActivityLog.objects.create(
        admin=request.user,
        user=user,
        action='password_reset',
        details={
            'id_number': user.id_number,
            'full_name': f"{user.first_name} {user.last_name}",
            'reset_to_default': True
        }
    )

    return Response({
        'success': True,
        'message': 'Password reset successfully to default',
        'user': {
            'id_number': user.id_number,
            'full_name': f"{user.first_name} {user.last_name}",
            'email': user.email
        }
    })

# --- Get Current User Profile ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_profile(request):
    serializer = UserSerializer(request.user, context={'request': request})
    return Response(serializer.data)

# --- Update Current User Profile ---
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    data = request.data.copy()
    
    # Handle password update
    if 'new_password' in data and data['new_password']:
        if 'current_password' not in data or not data['current_password']:
            return Response({
                'success': False,
                'message': 'Current password is required'
            }, status=400)
        
        # Verify current password
        if not user.check_password(data['current_password']):
            return Response({
                'success': False,
                'message': 'Current password is incorrect'
            }, status=400)
        
        # Set new password
        user.set_password(data['new_password'])
    
    # Handle avatar update
    if 'avatar' in request.FILES:
        user.avatar = request.FILES['avatar']
    
    user.save()
    
    # Log profile update
    ActivityLog.objects.create(
        user=user,
        action='profile_updated',
        details={
            'fields_updated': list(data.keys())
        }
    )
    
    return Response({
        'success': True,
        'message': 'Profile updated successfully',
        'user': UserSerializer(user).data
    })

# --- Update Avatar ---
# --- Update Avatar ---
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

    # Delete old avatar file if it exists and isn't the default
    if user.avatar and user.avatar.name != 'avatars/default.jpg':
        try:
            # Get the storage instance
            storage = user.avatar.storage
            # Delete the file
            storage.delete(user.avatar.name)
        except Exception as e:
            print(f"Error deleting old avatar: {e}")

    user.avatar = avatar
    user.save()

    # Log avatar update
    ActivityLog.objects.create(
        user=user,
        action='avatar_updated',
        details={
            'avatar_file': avatar.name
        }
    )

    cache_buster = int(datetime.now().timestamp())
    serializer = UserSerializer(user, context={'request': request})
    avatar_url = f"{serializer.data['avatar_url']}?t={cache_buster}"

    return Response({
        'success': True,
        'message': 'Avatar updated successfully',
        'avatar_url': avatar_url
    })

# --- Get Todos for Current User ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_todos(request):
    todos = Todo.objects.filter(owner=request.user)
    serializer = TodoSerializer(todos, many=True)
    return Response(serializer.data)

# --- Get Activity Logs (Admin only) ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_activity_logs(request):
    if request.user.user_level != 'admin':
        return Response({
            'success': False,
            'message': 'Only admin users can view activity logs'
        }, status=403)
    
    # Optional filters
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
            Q(user__id_number__icontains=search) |
            Q(user__first_name__icontains=search) |
            Q(user__last_name__icontains=search) |
            Q(admin__id_number__icontains=search) |
            Q(admin__first_name__icontains=search) |
            Q(admin__last_name__icontains=search) |
            Q(details__icontains=search)
        )
    
    # Pagination
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