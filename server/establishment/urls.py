from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EstablishmentViewSet

router = DefaultRouter()
router.register(r'establishments', EstablishmentViewSet, basename='establishment')

urlpatterns = [
    path('', include(router.urls)),
]