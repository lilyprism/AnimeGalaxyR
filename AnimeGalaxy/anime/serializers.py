from django.db.models import Avg
from drf_haystack.serializers import HaystackSerializerMixin
from rest_framework import serializers

from .models import Anime, Genre, Person, Season, Studio, UserAnimes


class GenreSerializer(serializers.ModelSerializer):
	class Meta:
		model = Genre
		fields = ['id', 'name']


class SeasonSerializer(serializers.ModelSerializer):
	class Meta:
		model = Season
		fields = ['id', 'name']

	name = serializers.SerializerMethodField()

	def get_name(self, instance: Season):
		return instance.__str__()


class PersonSerializer(serializers.ModelSerializer):
	class Meta:
		model = Person
		fields = ['id', 'name']


class StudioSerializer(serializers.ModelSerializer):
	class Meta:
		model = Studio
		fields = ['id', 'name']


class AnimeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Anime
		fields = ('id', 'name', 'genres', 'image', 'thumbnail', 'description', 'trailer', 'views', 'rating', 'seasons', 'author', 'director', 'studio', 'ongoing', 'start_date')

	name = serializers.CharField(source="__str__")
	genres = GenreSerializer(many=True)
	author = PersonSerializer()
	director = PersonSerializer()
	studio = StudioSerializer()
	image = serializers.SerializerMethodField()
	views = serializers.SerializerMethodField()
	rating = serializers.SerializerMethodField()
	ongoing = serializers.SerializerMethodField()
	seasons = SeasonSerializer(many=True)

	def get_rating(self, instance: Anime):
		rated = UserAnimes.objects.filter(rating__isnull=False, anime_id=instance.id)
		return {"number": rated.aggregate(Avg("rating")).get("rating__avg", 0) or 0, "votes": rated.count()}

	def get_image(self, instance):
		request = self.context.get('request')
		image_url = instance.image.url
		return request.build_absolute_uri(image_url)

	def get_thumbnail(self, instance):
		request = self.context.get('request')
		image_url = instance.thumbnail.url
		return request.build_absolute_uri(image_url)

	def get_ongoing(self, instance: Anime):
		return instance.ongoing

	def get_views(self, instance: Anime):
		return instance.views


class ExtraAnimeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Anime
		fields = ['id', 'name', 'genres', 'image', 'description', 'views', 'episodes']

	name = serializers.CharField(source="__str__")
	genres = GenreSerializer(many=True)
	image = serializers.SerializerMethodField()
	views = serializers.SerializerMethodField()
	episodes = serializers.SerializerMethodField()

	def get_views(self, instance: Anime):
		return instance.views

	def get_episodes(self, instance: Anime):
		return instance.episodes

	def get_image(self, instance):
		request = self.context.get('request')
		image_url = instance.image.url
		return request.build_absolute_uri(image_url)


class SimpleAnimeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Anime
		fields = ["id", "name", "genres", "image"]

	genres = GenreSerializer(many=True)


class GenrelessAnimeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Anime
		fields = ['id', 'name', 'image']


class AnimeSearchSerializer(HaystackSerializerMixin, ExtraAnimeSerializer):
	class Meta(ExtraAnimeSerializer.Meta):
		search_fields = ("name", "genres",)


class SeasonSerializer(serializers.ModelSerializer):
	class Meta:
		model = Season
		fields = ['id', 'anime', 'complete', 'number', 'name']

	anime = AnimeSerializer()


class SimpleSeasonSerializer(serializers.ModelSerializer):
	class Meta:
		model = Season
		fields = ['number', 'anime']

	anime = GenrelessAnimeSerializer()


class UserAnimeSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserAnimes
		fields = ['anime', 'rating']

	anime = AnimeSerializer()


class UserAnimeSimpleSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserAnimes
		fields = ['rating', 'anime', 'user']
