from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from datetime import timedelta
from django.utils import timezone

def default_avatar():
    return 'avatars/default.jpg'

class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('user_level', 'administrator')
        extra_fields.setdefault('status', 'active')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            **extra_fields
        )

class User(AbstractUser):
    USER_LEVEL_CHOICES = [
        ('administrator', 'Administrator'),
        ('division_chief', 'Division Chief'),
        ('eia_air_water_section_chief', 'EIA Air Water Section Chief'),
        ('toxic_hazardous_section_chief', 'Toxic Hazardous Section Chief'),
        ('solid_waste_section_chief', 'Solid Waste Section Chief'),
        ('eia_monitoring_unit_head', 'EIA Monitoring Unit Head'),
        ('air_quality_unit_head', 'Air Quality Unit Head'),
        ('water_quality_unit_head', 'Water Quality Unit Head'),
        ('eia_monitoring_personnel', 'EIA Monitoring Personnel'),
        ('air_quality_monitoring_personnel', 'Air Quality Monitoring Personnel'),
        ('water_quality_monitoring_personnel', 'Water Quality Monitoring Personnel'),
        ('toxic_chemicals_monitoring_personnel', 'Toxic Chemicals Monitoring Personnel'),
        ('solid_waste_monitoring_personnel', 'Solid Waste Monitoring Personnel'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    username = models.CharField(max_length=150, null=True, blank=True, unique=False)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    middle_name = models.CharField(max_length=150, blank=True)
    user_level = models.CharField(max_length=50, choices=USER_LEVEL_CHOICES, default='eia_monitoring_personnel')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    avatar = models.ImageField(
        upload_to='avatars/',
        null=True,
        blank=True,
        default=default_avatar
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

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

    @property
    def using_default_password(self):
        return self.check_password(settings.DEFAULT_USER_PASSWORD)

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

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
        ('otp_sent', 'OTP Sent'),
        ('password_reset_success', 'Password Reset Successful'),
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

class PasswordResetOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_otps')
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Password Reset OTP'
        verbose_name_plural = 'Password Reset OTPs'

    def __str__(self):
        return f"OTP for {self.user.email} (expires: {self.expires_at})"

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=15)
        super().save(*args, **kwargs)

class Todo(models.Model):
    name = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todos')

    def __str__(self):
        return f"{self.name} - {'Completed' if self.completed else 'Pending'}"