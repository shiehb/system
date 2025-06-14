# Generated by Django 5.2.1 on 2025-06-02 08:27

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_alter_user_avatar'),
    ]

    operations = [
        migrations.CreateModel(
            name='ActivityLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(choices=[('user_created', 'User Created'), ('password_reset', 'Password Reset'), ('status_changed', 'Status Changed'), ('user_updated', 'User Updated')], max_length=50)),
                ('details', models.JSONField(default=dict)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('admin', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='admin_actions', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_activities', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
