from django.contrib import admin
from .models import Establishment, NatureOfBusiness, EstablishmentPolygon

@admin.register(NatureOfBusiness)
class NatureOfBusinessAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(EstablishmentPolygon)
class EstablishmentPolygonAdmin(admin.ModelAdmin):
    list_display = ('establishment', 'created_at', 'updated_at')
    search_fields = ('establishment__name',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Establishment)
class EstablishmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'city', 'province', 'is_archived', 'created_at')
    list_filter = ('region', 'province', 'city', 'nature_of_business', 'is_archived')
    search_fields = ('name', 'address_line', 'barangay')
    readonly_fields = ('created_at', 'updated_at')
    actions = ['archive_establishments', 'unarchive_establishments']

    def archive_establishments(self, request, queryset):
        queryset.update(is_archived=True)
    archive_establishments.short_description = "Archive selected establishments"

    def unarchive_establishments(self, request, queryset):
        queryset.update(is_archived=False)
    unarchive_establishments.short_description = "Unarchive selected establishments"