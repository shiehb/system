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

from .models import Todo, User
from .serializers import TodoSerializer, UserRegisterSerializer, UserSerializer


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

# --- Update User (Admin only) -
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
    
    return Response({
        'success': True,
        'message': 'Profile updated successfully',
        'user': UserSerializer(user).data
    })


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

    user.avatar = avatar
    user.save()

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
