from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.http import Http404

from .models import Establishment, NatureOfBusiness, EstablishmentPolygon
from .serializers import (EstablishmentSerializer, 
                         NatureOfBusinessSerializer,
                         EstablishmentPolygonSerializer)

class NatureOfBusinessViewSet(viewsets.ModelViewSet):
    queryset = NatureOfBusiness.objects.all()
    serializer_class = NatureOfBusinessSerializer
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def options(self, request):
        business_types = NatureOfBusiness.objects.all().order_by('name')
        serializer = self.get_serializer(business_types, many=True)
        return Response({
            'status': 'success',
            'data': [{'value': item['id'], 'label': item['name']} for item in serializer.data]
        })

class EstablishmentPolygonViewSet(viewsets.ModelViewSet):
    queryset = EstablishmentPolygon.objects.all()
    serializer_class = EstablishmentPolygonSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                {
                    'status': 'success',
                    'data': serializer.data
                },
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        except ValidationError as exc:
            return Response(
                {
                    'status': 'error',
                    'errors': exc.detail
                },
                status=status.HTTP_400_BAD_REQUEST
            )

class EstablishmentViewSet(viewsets.ModelViewSet):
    queryset = Establishment.objects.filter(is_archived=False)
    serializer_class = EstablishmentSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.query_params.get('show_archived') == 'true':
            queryset = Establishment.objects.filter(is_archived=True)
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                {
                    'status': 'success',
                    'data': serializer.data
                },
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        except ValidationError as exc:
            return Response(
                {
                    'status': 'error',
                    'errors': exc.detail
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(
                {
                    'status': 'success',
                    'data': serializer.data
                },
                status=status.HTTP_200_OK
            )
        except ValidationError as exc:
            return Response(
                {
                    'status': 'error',
                    'errors': exc.detail
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        establishment = self.get_object()
        establishment.is_archived = True
        establishment.save()
        serializer = self.get_serializer(establishment)
        return Response({
            'status': 'success',
            'data': serializer.data,
            'message': 'Establishment archived successfully'
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def unarchive(self, request, pk=None):
        establishment = self.get_object()
        establishment.is_archived = False
        establishment.save()
        serializer = self.get_serializer(establishment)
        return Response({
            'status': 'success',
            'data': serializer.data,
            'message': 'Establishment unarchived successfully'
        }, status=status.HTTP_200_OK)