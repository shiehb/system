from django.urls import path
from .views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    logout,
    register,
    is_logged_in,
    get_users,
    update_user,
    change_user_status,
    get_activity_logs,
    get_todos,
    update_avatar,
    get_my_profile,
    update_profile,
    admin_reset_password
)

urlpatterns = [
    # Authentication endpoints
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('authenticated/', is_logged_in, name='check_auth'),
    path('logout/', logout, name='logout'),

    # User management endpoints
    path('register/', register, name='register'),
    path('admin-reset-password/', admin_reset_password, name='admin_reset_password'),
    path('users/', get_users, name='get_users'),
    path('users/<int:pk>/', update_user, name='update_user'),
    path('users/<int:pk>/status/', change_user_status, name='change_user_status'),
    path('activity-logs/', get_activity_logs, name='get_activity_logs'),

    # Profile endpoints
    path('me/', get_my_profile, name='get_my_profile'),
    path('me/update/', update_profile, name='update_profile'),
    path('update-avatar/', update_avatar, name='update_avatar'),

    # Todo endpoints
    path('todos/', get_todos, name='get_todos'),
]