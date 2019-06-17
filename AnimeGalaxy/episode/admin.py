from django.contrib import admin

from .models import Episode


@admin.register(Episode)
class EpisodeAdmin(admin.ModelAdmin):
	list_filter = ['anime']
	list_per_page = 24

	fieldsets = (
		('Configurações Gerais', {
			'fields': ('anime', 'number', 'blogger_url')
		}),
	)
