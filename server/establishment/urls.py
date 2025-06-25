from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EstablishmentViewSet

# Create a router and register our ViewSet
router = DefaultRouter()
router.register(r'establishments', EstablishmentViewSet, basename='establishment')

urlpatterns = [
    path('', include(router.urls)),
]