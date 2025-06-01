from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

# Define the default avatar path using a regular function (not a lambda)
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
        ('inspector', 'Inspector'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    username = models.CharField(max_length=150, null=True, blank=True, unique=False)
    id_number = models.CharField(max_length=50, unique=True)
    middle_name = models.CharField(max_length=150, blank=True)
    user_level = models.CharField(max_length=20, choices=USER_LEVEL_CHOICES, default='inspector')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
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
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.id_number})"

class Todo(models.Model):
    name = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todo')
