from django.contrib import admin
from .models import Establishment

@admin.register(Establishment)
class EstablishmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'city', 'province', 'created_at')
    list_filter = ('region', 'province', 'city')
    search_fields = ('name', 'address_line', 'barangay')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'owner', 'year_established')
        }),
        ('Address Details', {
            'fields': (
                'address_line',
                'barangay',
                'city',
                'province',
                'region',
                'postal_code'
            )
        }),
        ('Geo Location', {
            'fields': ('latitude', 'longitude')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at')
        }),
    )