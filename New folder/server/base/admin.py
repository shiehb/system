from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django import forms
from .models import User, Todo, ActivityLog

class UserCreationForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name')

    def clean(self):
        cleaned_data = super().clean()
        user_level = cleaned_data.get('user_level')
        valid_levels = [choice[0] for choice in User.USER_LEVEL_CHOICES]
        
        if user_level not in valid_levels:
            raise forms.ValidationError(f"Invalid user level. Must be one of: {', '.join(valid_levels)}")
        
        return cleaned_data

class CustomUserAdmin(UserAdmin):
    form = UserCreationForm
    list_display = ('email', 'first_name', 'last_name', 'user_level', 'status')
    list_filter = ('user_level', 'status')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'middle_name')}),
        ('Permissions', {
            'fields': ('user_level', 'status', 'is_active', 'is_staff', 'is_superuser'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'password1', 'password2',
                'first_name', 'last_name', 'middle_name',
                'user_level', 'status', 'avatar'
            ),
        }),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

admin.site.register(User, CustomUserAdmin)
admin.site.register(Todo)

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('admin', 'action', 'user', 'created_at')
    list_filter = ('action', 'created_at')
    search_fields = ('admin__email', 'admin__first_name', 'admin__last_name', 
                    'user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('admin', 'user', 'action', 'details', 'created_at')
    ordering = ('-created_at',)