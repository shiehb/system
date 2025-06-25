from rest_framework import serializers
from .models import Establishment

class EstablishmentSerializer(serializers.ModelSerializer):
    address = serializers.SerializerMethodField()
    coordinates = serializers.SerializerMethodField()
    year = serializers.CharField(source='year_established', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    
    class Meta:
        model = Establishment
        fields = [
            'id', 'name', 'address', 'coordinates', 'year', 'createdAt',
            'address_line', 'barangay', 'city', 'province', 'region', 
            'postal_code', 'latitude', 'longitude', 'year_established'
        ]
        extra_kwargs = {
            'address_line': {'write_only': True},
            'barangay': {'write_only': True},
            'city': {'write_only': True},
            'province': {'write_only': True},
            'region': {'write_only': True},
            'postal_code': {'write_only': True},
            'latitude': {'write_only': True},
            'longitude': {'write_only': True},
            'year_established': {'write_only': True},
        }
    
    def create(self, validated_data):
        # Set owner to current user
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)
    
    def get_address(self, obj):
        return obj.full_address
    
    def get_coordinates(self, obj):
        if obj.latitude and obj.longitude:
            return f"{obj.latitude}, {obj.longitude}"
        return "Not available"