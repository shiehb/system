from rest_framework import serializers
from .models import Establishment, NatureOfBusiness, EstablishmentPolygon

class NatureOfBusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = NatureOfBusiness
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class EstablishmentPolygonSerializer(serializers.ModelSerializer):
    establishment_id = serializers.PrimaryKeyRelatedField(
        queryset=Establishment.objects.all(),
        source='establishment',
        write_only=True
    )
    establishment = serializers.StringRelatedField(read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = EstablishmentPolygon
        fields = ['id', 'establishment', 'establishment_id', 'coordinates', 'createdAt']
        read_only_fields = ['createdAt']

class EstablishmentSerializer(serializers.ModelSerializer):
    address = serializers.SerializerMethodField()
    coordinates = serializers.SerializerMethodField()
    year = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    nature_of_business = NatureOfBusinessSerializer(read_only=True)
    nature_of_business_id = serializers.PrimaryKeyRelatedField(
        queryset=NatureOfBusiness.objects.all(),
        source='nature_of_business',
        write_only=True,
        required=False,
        allow_null=True
    )
    polygon = EstablishmentPolygonSerializer(read_only=True)
    is_archived = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Establishment
        fields = [
            'id', 'name', 'address', 'coordinates', 'year', 'createdAt',
            'address_line', 'barangay', 'city', 'province', 'region', 
            'postal_code', 'latitude', 'longitude', 'year_established',
            'nature_of_business', 'nature_of_business_id', 'polygon',
            'is_archived'
        ]
    
    def get_address(self, obj):
        return obj.address
    
    def get_coordinates(self, obj):
        return obj.coordinates
    
    def get_year(self, obj):
        return str(obj.year_established) if obj.year_established else ""