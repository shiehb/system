from rest_framework import serializers
from .models import User, Todo, ActivityLog
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

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
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

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

class ActivityLogSerializer(serializers.ModelSerializer):
    admin = UserSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ActivityLog
        fields = ['id', 'admin', 'user', 'action', 'details', 'created_at']
        read_only_fields = fields

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'name', 'completed']