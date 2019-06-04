from django.contrib import admin

from .models import Anime, CustomUser, Episode, Genre, Report, UserEpisodes


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
	fieldsets = (
		('Configurações Gerais', {
			'fields': ('name',)
		}),
	)


@admin.register(Anime)
class AnimeAdmin(admin.ModelAdmin):
	fieldsets = (
		('Configurações Gerais', {
			'fields': ('name', 'description')
		}),
		('Configurações Avançadas', {
			'classes': ('wide', 'collapse'),
			'fields' : ('genres', 'image', 'thumbnail'),
		})
	)


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
	list_filter = ['classifier']
	list_per_page = 24


@admin.register(Episode)
class EpisodeAdmin(admin.ModelAdmin):

	list_filter = ['anime']
	list_per_page = 24

	fieldsets = (
		('Configurações Gerais', {
			'fields': ('anime', 'number', 'blogger_url')
		}),
	)


class EpisodeInline(admin.TabularInline):
	model = UserEpisodes
	extra = 1


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
	inlines = [EpisodeInline]

	fieldsets = (
		('Configurações Gerais', {
			'fields': ('username', 'first_name', 'last_name', 'email', 'avatar', 'password')
		}),
		('Configurações Avançadas', {
			'classes': ('collapse',),
			'fields' : ('is_staff', 'is_active', 'groups', 'user_permissions'),
		}),
	)
