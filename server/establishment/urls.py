from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (EstablishmentViewSet, 
                   NatureOfBusinessViewSet,
                   EstablishmentPolygonViewSet)

router = DefaultRouter()
router.register(r'establishments', EstablishmentViewSet, basename='establishment')
router.register(r'nature-of-business', NatureOfBusinessViewSet, basename='nature-of-business')
router.register(r'polygons', EstablishmentPolygonViewSet, basename='polygon')

urlpatterns = [
    path('', include(router.urls)),
]