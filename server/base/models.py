from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

def default_avatar():
    return 'avatars/default.jpg'

class UserManager(BaseUserManager):
    def create_user(self, id_number, email, first_name, last_name, password=None, **extra_fields):
        if not id_number:
            raise ValueError('Users must have an ID number')
        if not email:
            raise ValueError('Users must have an email address')
        
        email = self.normalize_email(email)
        user = self.model(
            id_number=id_number,
            email=email,
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, id_number, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('user_level', 'admin')
        extra_fields.setdefault('status', 'active')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(
            id_number=id_number,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            **extra_fields
        )

class User(AbstractUser):
    USER_LEVEL_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('chief', 'Chief'),
        ('inspector', 'Inspector'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    
    ROLE_CHOICES = [
        ('RA-6969', 'RA-6969'),
        ('RA-8749', 'RA-8749'),
        ('RA-9275', 'RA-9275'),
        ('RA-9003', 'RA-9003'),
    ]

    username = models.CharField(max_length=150, null=True, blank=True, unique=False)
    id_number = models.CharField(max_length=50, unique=True)
    middle_name = models.CharField(max_length=150, blank=True)
    user_level = models.CharField(max_length=20, choices=USER_LEVEL_CHOICES, default='inspector')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        blank=True,
        null=True,
        help_text='Applicable only for Inspector and Chief roles'
    )
    avatar = models.ImageField(
        upload_to='avatars/',
        null=True,
        blank=True,
        default=default_avatar
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'id_number'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    objects = UserManager()

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        help_text=_('The groups this user belongs to.'),
        related_name="custom_user_set",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name="custom_user_set",
        related_query_name="user",
    )

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.id_number
        # Clear role if user is not inspector or chief
        if self.user_level not in ['inspector', 'chief']:
            self.role = None
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.id_number})"

class ActivityLog(models.Model):
    ACTION_CHOICES = [
        ('user_created', 'User Created'),
        ('password_reset', 'Password Reset'),
        ('status_changed', 'Status Changed'),
        ('user_updated', 'User Updated'),
        ('user_deleted', 'User Deleted'),
        ('profile_updated', 'Profile Updated'),
        ('avatar_updated', 'Avatar Updated'),
        ('login', 'User Login'),
        ('logout', 'User Logout'),
    ]

    admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='admin_actions')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='user_activities')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    details = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Activity Log'
        verbose_name_plural = 'Activity Logs'

    def __str__(self):
        if self.admin and self.user:
            return f"{self.admin} {self.get_action_display()} for {self.user} at {self.created_at}"
        elif self.user:
            return f"{self.user} performed {self.get_action_display()} at {self.created_at}"
        else:
            return f"System: {self.get_action_display()} at {self.created_at}"

class Todo(models.Model):
    name = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todo')