from django.contrib import admin

from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
	list_filter = ['classifier']
	list_per_page = 24
