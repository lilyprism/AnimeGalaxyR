from django.contrib import admin

from .models import Anime, CustomUser, Episode, Genre, Quality, UserEpisodes, Video


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
			'fields': ('name', 'description')
		}),
		('Configurações Avançadas', {
			'classes': ('wide', 'collapse'),
			'fields' : ('genres', 'image', 'thumbnail'),
		})
	)


@admin.register(Episode)
class EpisodeAdmin(admin.ModelAdmin):
	inlines = [VideoInline, ]

	list_filter = ['anime']
	list_per_page = 24

	fieldsets = (
		('Configurações Gerais', {
			'fields': ('anime', 'number',)
		}),
	)


class EpisodeInline(admin.TabularInline):
	model = UserEpisodes
	extra = 1

	def get_queryset(self, request):
		return UserEpisodes.objects.filter(user=request.user.id)


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
