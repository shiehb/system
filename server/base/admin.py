from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Todo, ActivityLog

class CustomUserAdmin(UserAdmin):
    list_display = ('id_number', 'first_name', 'last_name', 'email', 'user_level', 'status')
    list_filter = ('user_level', 'status')
    fieldsets = (
        (None, {'fields': ('id_number', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'middle_name', 'email')}),
        ('Permissions', {'fields': ('user_level', 'status', 'is_active', 'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('id_number', 'password1', 'password2', 'first_name', 'last_name', 'middle_name', 'email', 'user_level', 'status','avatar'),
        }),
    )
    search_fields = ('id_number', 'first_name', 'last_name', 'email')
    ordering = ('id_number',)

    def save_model(self, request, obj, form, change):
        obj.username = obj.id_number
        super().save_model(request, obj, form, change)

admin.site.register(User, CustomUserAdmin)
admin.site.register(Todo)

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('admin', 'action', 'user', 'created_at')
    list_filter = ('action', 'created_at')
    search_fields = ('admin__id_number', 'admin__first_name', 'admin__last_name', 
                    'user__id_number', 'user__first_name', 'user__last_name')
    readonly_fields = ('admin', 'user', 'action', 'details', 'created_at')
    ordering = ('-created_at',)  # Ensures proper ordering in admin