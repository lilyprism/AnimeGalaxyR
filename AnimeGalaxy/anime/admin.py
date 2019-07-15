from django.contrib import admin

from .models import Anime, Genre, Person, Season, Studio, UserAnimes


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
			'fields': ('name', 'description', 'author', 'director', 'studio', 'start_date')
		}),
		('Configurações Avançadas', {
			'classes': ('wide',),
			'fields' : ('genres', 'image', 'thumbnail', 'trailer'),
		})
	)


@admin.register(UserAnimes)
class UserAnimesAdmin(admin.ModelAdmin):
	list_filter = ['anime', 'user']
	list_per_page = 20


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
	pass


@admin.register(Studio)
class StudioAdmin(admin.ModelAdmin):
	pass


@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
	pass
