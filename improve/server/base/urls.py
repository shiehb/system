from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', views.CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.logout, name='logout'),
    path('authenticated/', views.is_logged_in, name='authenticated'),
    
    # Password reset endpoints
    path('request-password-reset/', views.request_password_reset, name='request_password_reset'),
    path('verify-password-reset/', views.verify_password_reset, name='verify_password_reset'),
    
    # User management endpoints
    path('register/', views.register, name='register'),
    path('users/', views.get_users, name='get_users'),
    path('users/<int:pk>/', views.update_user, name='update_user'),
    path('users/<int:pk>/status/', views.change_user_status, name='change_user_status'),
    path('users/<int:pk>/delete/', views.delete_user, name='delete_user'),
    path('admin-reset-password/', views.admin_reset_password, name='admin_reset_password'),
    
    # Profile endpoints
    path('me/', views.get_my_profile, name='get_my_profile'),
    path('me/update/', views.update_profile, name='update_profile'),
    path('update-avatar/', views.update_avatar, name='update_avatar'),
    
    # Activity logs
    path('activity-logs/', views.get_activity_logs, name='get_activity_logs'),
    
    # Todos
    path('todos/', views.get_todos, name='get_todos'),
]
