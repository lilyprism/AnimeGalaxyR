from django.contrib import admin

from .models import Anime, Genre


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
	fieldsets = (
		('Configurações Gerais', {
			'fields': ('name',)
		}),
	)


@admin.register(Anime)
class AnimeAdmin(admin.ModelAdmin):
	list_filter = ["complete", "genres"]
	list_per_page = 10

	fieldsets = (
		('Configurações Gerais', {
			'fields': ('name', 'description', 'complete')
		}),
		('Configurações Avançadas', {
			'classes': ('wide', 'collapse'),
			'fields' : ('genres', 'image', 'thumbnail'),
		})
	)
