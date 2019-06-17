from drf_haystack.serializers import HaystackSerializerMixin
from rest_framework import serializers

from .models import Anime, Genre


class GenreSerializer(serializers.ModelSerializer):
	class Meta:
		model = Genre
		fields = ['id', 'name']


class AnimeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Anime
		fields = ('id', 'name', 'genres', 'image', 'thumbnail', 'description', 'complete')

	genres = GenreSerializer(many=True)
	image = serializers.SerializerMethodField()

	def get_image(self, instance):
		request = self.context.get('request')
		image_url = instance.image.url
		return request.build_absolute_uri(image_url)

	def get_thumbnail(self, instance):
		request = self.context.get('request')
		image_url = instance.thumbnail.url
		return request.build_absolute_uri(image_url)


class SimpleAnimeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Anime
		fields = ["id", "name", "genres", "image"]

	genres = GenreSerializer(many=True)


class AnimeSearchSerializer(HaystackSerializerMixin, SimpleAnimeSerializer):
	class Meta(SimpleAnimeSerializer.Meta):
		search_fields = ("name", "genres",)
