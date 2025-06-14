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
    user_level = serializers.CharField(required=False, default='inspector')
    status = serializers.CharField(required=False, default='active')
    role = serializers.CharField(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = [
            'id_number', 
            'password',
            'first_name',
            'last_name',
            'middle_name',
            'email',
            'user_level',
            'status',
            'role'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'user_level': {'required': False},
            'status': {'required': False},
            'role': {'required': False},
        }

    def validate(self, data):
        user_level = data.get('user_level', 'inspector')
        role = data.get('role')
        
        if user_level in ['inspector', 'chief'] and not role:
            raise serializers.ValidationError({"role": "Role is required for Inspector and Chief users"})
        elif user_level not in ['inspector', 'chief'] and role:
            raise serializers.ValidationError({"role": "Role is only applicable for Inspector and Chief users"})
        
        return data

    def validate_id_number(self, value):
        if User.objects.filter(id_number=value).exists():
            raise serializers.ValidationError("A user with this ID number already exists.")
        return value

    def validate_email(self, value):
        value = self.initial_data.get('email', value)
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        if not password:
            password = settings.DEFAULT_USER_PASSWORD

        try:
            user = User.objects.create_user(
                id_number=validated_data['id_number'],
                email=validated_data['email'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                password=password,
                middle_name=validated_data.get('middle_name', ''),
                user_level=validated_data.get('user_level', 'inspector'),
                status=validated_data.get('status', 'active'),
                role=validated_data.get('role')
            )
            return user
        except Exception as e:
            raise serializers.ValidationError(str(e))

class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id',
            'id_number',
            'first_name',
            'last_name',
            'middle_name',
            'email',
            'user_level',
            'status',
            'role',
            'avatar',
            'avatar_url',
            'created_at',
            'updated_at'
        ]
        extra_kwargs = {
            'id_number': {'read_only': True},
            'avatar': {'write_only': True}
        }
    
    def validate(self, data):
        user_level = data.get('user_level', self.instance.user_level if self.instance else 'inspector')
        role = data.get('role', self.instance.role if self.instance else None)
        
        if user_level in ['inspector', 'chief'] and not role:
            raise serializers.ValidationError({"role": "Role is required for Inspector and Chief users"})
        elif user_level not in ['inspector', 'chief'] and role:
            raise serializers.ValidationError({"role": "Role is only applicable for Inspector and Chief users"})
        
        return data
    
    def get_avatar_url(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None

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