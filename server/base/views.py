from .models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from .models import Todo
from .serializers import TodoSerializer, UserRegisterSerializer, UserSerializer

from datetime import datetime, timedelta

from rest_framework import generics
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed


#This is for logging in
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

            res = Response()
            res.data = {'success': True}

            res.set_cookie(
                key='access_token',
                value=str(tokens['access']),
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            res.set_cookie(
                key='refresh_token',
                value=str(tokens['refresh']),
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
        

# This is for checking if the user is logged in      
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_logged_in(request):
    if request.user.status != 'active':
        return Response({
            'success': False,
            'message': 'Your account is not active'
        }, status=403)
    
    serializer = UserSerializer(request.user, many=False)
    return Response(serializer.data)


 # This is for refreshing the token       
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)
            
            tokens = response.data
            access_token = tokens['access']

            res = Response()
            res.data = {'refreshed': True}

            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            return res
        except Exception as e:
            print(e)
            return Response({'refreshed': False})


# This is for logging out
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        res = Response()
        res.data = {'success':True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/', samesite='None')
        return res
    except Exception as e:
        print(e)
        return Response({'success':False})


#This is for registering a new user
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Changed from AllowAny to IsAuthenticated
def register(request):
    # Check if the requesting user is an admin
    if request.user.user_level != 'admin':
        return Response({
            'success': False,
            'message': 'Only admin users can create new accounts'
        }, status=403)

    print("Registration request data:", request.data)
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

# This is for getting the list of user's information accessible by the admin user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    if request.user.user_level != 'admin':
        raise PermissionDenied("Only admin users can view the user list")
    
    # Get all users except current admin
    queryset = User.objects.exclude(id=request.user.id)
    
    # Apply filters if provided
    status = request.query_params.get('status')
    if status:
        queryset = queryset.filter(status=status)
    
    user_level = request.query_params.get('user_level')
    if user_level:
        queryset = queryset.filter(user_level=user_level)
    
    # Order the results and serialize
    queryset = queryset.order_by('id_number')
    serializer = UserSerializer(queryset, many=True)
    
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_todos(request):
    user = request.user
    todos = Todo.objects.filter(owner=user)
    serializer = TodoSerializer(todos, many=True)
    return Response(serializer.data)
