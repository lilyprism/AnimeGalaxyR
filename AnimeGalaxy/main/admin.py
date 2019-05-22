from django.contrib import admin

from .models import Anime, CustomUser, Episode, Genre, Quality, Video


class VideoInline(admin.TabularInline):
	model = Video
	extra = 1


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
	fieldsets = (
		('Configurações Gerais', {
			'fields': ('name',)
		}),
	)


@admin.register(Quality)
class QualityAdmin(admin.ModelAdmin):
	fieldsets = (
		('Configurações Gerais', {
			'fields': ('name',)
		}),
	)


@admin.register(Anime)
class AnimeAdmin(admin.ModelAdmin):
	fieldsets = (
		('Configurações Gerais', {
			'fields': ('name', 'image', 'description')
		}),
		('Configurações Avançadas', {
			'classes': ('wide', 'collapse'),
			'fields' : ('genres',),
		})
	)


@admin.register(Episode)
class EpisodeAdmin(admin.ModelAdmin):
	inlines = [VideoInline, ]

	fieldsets = (
		('Configurações Gerais', {
			'fields': ('anime', 'number',)
		}),
		('Configurações Avançadas', {
			'classes': ('wide',),
			'fields' : ('image',),
		}),
	)


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
	fieldsets = (
		('Configurações Gerais', {
			'fields': ('url',)
		}),
		('Configurações Avançadas', {
			'classes': ('wide',),
			'fields' : ('episode', 'quality',),
		}),
	)


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
