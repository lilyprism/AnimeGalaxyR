from django.contrib import admin

from .models import Episode, UserEpisodes


@admin.register(Episode)
class EpisodeAdmin(admin.ModelAdmin):
	list_filter = ['anime']
	list_per_page = 24

	fieldsets = (
		('Configurações Gerais', {
			'fields': ('anime', 'number', 'blogger_url')
		}),
	)


@admin.register(UserEpisodes)
class UserEpisodeAdmin(admin.ModelAdmin):
	list_filter = ['episode__anime']
	list_per_page = 24
