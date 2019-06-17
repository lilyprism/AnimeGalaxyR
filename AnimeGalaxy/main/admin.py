from django.contrib import admin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):

	fieldsets = (
		('Configurações Gerais', {
			'fields': ('username', 'first_name', 'last_name', 'email', 'avatar', 'password')
		}),
		('Configurações Avançadas', {
			'classes': ('collapse',),
			'fields' : ('is_staff', 'is_active', 'groups', 'user_permissions'),
		}),
	)
