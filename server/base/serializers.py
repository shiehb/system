from rest_framework import serializers
from .models import User, Todo, ActivityLog, PasswordResetOTP
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from datetime import timedelta
from django.utils import timezone
from django.core.exceptions import ValidationError

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
    )
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    middle_name = serializers.CharField(required=False, allow_blank=True)
    user_level = serializers.CharField(required=False, default='eia_monitoring_personnel')
    status = serializers.CharField(required=False, default='active')
    
    class Meta:
        model = User
        fields = [
            'email',
            'password',
            'first_name',
            'last_name',
            'middle_name',
            'user_level',
            'status'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'user_level': {'required': False},
            'status': {'required': False},
        }

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value.lower()).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def validate(self, data):
        user_level = data.get('user_level', 'eia_monitoring_personnel')
        valid_levels = [choice[0] for choice in User.USER_LEVEL_CHOICES]
        
        if user_level not in valid_levels:
            raise serializers.ValidationError({
                "user_level": f"Invalid user level. Must be one of: {', '.join(valid_levels)}"
            })
        
        return data

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        if not password:
            password = settings.DEFAULT_USER_PASSWORD

        try:
            user = User.objects.create_user(
                email=validated_data['email'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                password=password,
                middle_name=validated_data.get('middle_name', ''),
                user_level=validated_data.get('user_level', 'eia_monitoring_personnel'),
                status=validated_data.get('status', 'active')
            )
            return user
        except Exception as e:
            raise serializers.ValidationError(str(e))

class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    using_default_password = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'middle_name',
            'user_level',
            'status',
            'avatar',
            'avatar_url',
            'using_default_password',
            'created_at',
            'updated_at'
        ]
        extra_kwargs = {
            'email': {'read_only': True},
            'avatar': {'write_only': True}
        }
    
    def get_avatar_url(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request:
                url = request.build_absolute_uri(obj.avatar.url)
                return f"{url}?t={int(obj.updated_at.timestamp())}"
            return obj.avatar.url
        return None
    
    def get_using_default_password(self, obj):
        return obj.using_default_password

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        """
        Validate email format but don't reveal if it exists in the system
        """
        return value.lower().strip()

class PasswordResetVerifySerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    otp = serializers.CharField(
        required=True,
        max_length=6,
        min_length=6,
        help_text="6-digit OTP code"
    )
    new_password = serializers.CharField(
        required=True,
        min_length=8,
        help_text="New password (minimum 8 characters)",
        write_only=True
    )

    def validate_email(self, value):
        try:
            # Case-insensitive lookup and return user object
            user = User.objects.get(email__iexact=value.lower())
            return user
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or OTP")

    def validate_otp(self, value):
        value = value.strip()
        if not value.isdigit() or len(value) != 6:
            raise serializers.ValidationError("OTP must be a 6-digit number.")
        return value

    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value

    def validate(self, data):
        user = data['email']  # This is the user instance from validate_email
        otp = data['otp']

        # Check for valid OTP
        otp_record = PasswordResetOTP.objects.filter(
            user=user,
            otp=otp,
            is_used=False,
            expires_at__gt=timezone.now()
        ).order_by('-created_at').first()

        if not otp_record:
            raise serializers.ValidationError({
                'otp': 'Invalid or expired OTP'
            })

        data['otp_record'] = otp_record
        return data

class ActivityLogSerializer(serializers.ModelSerializer):
    admin = UserSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    
    class Meta:
        model = ActivityLog
        fields = ['id', 'admin', 'user', 'action', 'action_display', 'details', 'created_at']
        read_only_fields = fields

class PasswordResetOTPSerializer(serializers.ModelSerializer):
    is_valid = serializers.SerializerMethodField()
    time_remaining = serializers.SerializerMethodField()

    class Meta:
        model = PasswordResetOTP
        fields = ['id', 'otp', 'created_at', 'expires_at', 'is_used', 'is_valid', 'time_remaining']
        read_only_fields = fields

    def get_is_valid(self, obj):
        return obj.is_valid()

    def get_time_remaining(self, obj):
        if obj.is_used:
            return 0
        remaining = (obj.expires_at - timezone.now()).total_seconds()
        return max(0, remaining)

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'name', 'completed']