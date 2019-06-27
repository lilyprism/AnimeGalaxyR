from django.contrib import admin

from .models import Anime, Genre, Season


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
	fieldsets = (
		('Configurações Gerais', {
			'fields': ('name',)
		}),
	)


@admin.register(Anime)
class AnimeAdmin(admin.ModelAdmin):
	list_filter = ["genres"]
	list_per_page = 10

	fieldsets = (
		('Configurações Gerais', {
			'fields': ('name', 'description')
		}),
		('Configurações Avançadas', {
			'classes': ('wide',),
			'fields' : ('genres', 'image', 'thumbnail'),
		})
	)


@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
	pass
