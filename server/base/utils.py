from .models import ActivityLog

def log_admin_action(admin_user, action, user=None, details=None):
    """
    Log an admin action to the activity log
    """
    ActivityLog.objects.create(
        admin=admin_user,
        user=user,
        action=action,
        details=details or {}
    )

def log_user_login(user):
    ActivityLog.objects.create(
        user=user,
        action='login',
        details={'ip_address': "Get from request if available"}
    )

def log_user_logout(user):
    ActivityLog.objects.create(
        user=user,
        action='logout'
    )

def log_avatar_update(admin, user):
    ActivityLog.objects.create(
        admin=admin,
        user=user,
        action='avatar_updated'
    )

def log_profile_update(admin, user):
    ActivityLog.objects.create(
        admin=admin,
        user=user,
        action='profile_updated'
    )