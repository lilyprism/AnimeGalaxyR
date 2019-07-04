from django.db.models import Count, Sum
from drf_haystack.serializers import HaystackSerializerMixin
from rest_framework import serializers

from .models import Anime, Genre, Season


class GenreSerializer(serializers.ModelSerializer):
	class Meta:
		model = Genre
		fields = ['id', 'name']


class AnimeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Anime
		fields = ('id', 'name', 'genres', 'image', 'thumbnail', 'description', 'views')

	name = serializers.CharField(source="__str__")
	genres = GenreSerializer(many=True)
	image = serializers.SerializerMethodField()
	views = serializers.SerializerMethodField()

	def get_views(self, instance: Anime):
		count = instance.seasons.aggregate(Sum("episodes__views"))
		return count.get("episodes__views__sum", 0)

	def get_image(self, instance):
		request = self.context.get('request')
		image_url = instance.image.url
		return request.build_absolute_uri(image_url)

	def get_thumbnail(self, instance):
		request = self.context.get('request')
		image_url = instance.thumbnail.url
		return request.build_absolute_uri(image_url)


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
		count = instance.seasons.aggregate(Sum("episodes__views"))
		return count.get("episodes__views__sum", 0)

	def get_episodes(self, instance: Anime):
		count = instance.seasons.aggregate(Count("episodes"))
		return count.get("episodes__count", 0)

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
