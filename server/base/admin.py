from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django import forms
from .models import User, Todo, ActivityLog

class UserCreationForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('id_number', 'email', 'first_name', 'last_name')

    def clean(self):
        cleaned_data = super().clean()
        user_level = cleaned_data.get('user_level')
        role = cleaned_data.get('role')
        
        if user_level in ['inspector', 'chief'] and not role:
            raise forms.ValidationError("Role is required for Inspector and Chief users")
        elif user_level not in ['inspector', 'chief'] and role:
            raise forms.ValidationError("Role is only applicable for Inspector and Chief users")
        
        return cleaned_data

class CustomUserAdmin(UserAdmin):
    form = UserCreationForm
    list_display = ('id_number', 'first_name', 'last_name', 'email', 'user_level', 'status', 'role')
    list_filter = ('user_level', 'status', 'role')
    fieldsets = (
        (None, {'fields': ('id_number', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'middle_name', 'email')}),
        ('Permissions', {
            'fields': ('user_level', 'status', 'role', 'is_active', 'is_staff', 'is_superuser'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'id_number', 'password1', 'password2',
                'first_name', 'last_name', 'middle_name',
                'email', 'user_level', 'status', 'role', 'avatar'
            ),
        }),
    )
    search_fields = ('id_number', 'first_name', 'last_name', 'email')
    ordering = ('id_number',)

    def save_model(self, request, obj, form, change):
        obj.username = obj.id_number
        if obj.user_level not in ['inspector', 'chief']:
            obj.role = None
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
    ordering = ('-created_at',)