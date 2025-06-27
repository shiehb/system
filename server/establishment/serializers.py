from rest_framework import serializers
from .models import Establishment

class EstablishmentSerializer(serializers.ModelSerializer):
    address = serializers.SerializerMethodField()
    coordinates = serializers.SerializerMethodField()
    year = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    
    class Meta:
        model = Establishment
        fields = [
            'id', 'name', 'address', 'coordinates', 'year', 'createdAt',
            'address_line', 'barangay', 'city', 'province', 'region', 
            'postal_code', 'latitude', 'longitude', 'year_established',
            'nature_of_business'
        ]
    
    def get_address(self, obj):
        return obj.address
    
    def get_coordinates(self, obj):
        return obj.coordinates
    
    def get_year(self, obj):
        return str(obj.year_established) if obj.year_established else ""