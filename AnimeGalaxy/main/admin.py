from django.contrib import admin

from .models import CustomUser, Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
	list_filter = ['classifier']
	list_per_page = 24


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
