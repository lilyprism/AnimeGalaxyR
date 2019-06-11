from drf_haystack.serializers import HaystackSerializerMixin
from rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField

from .models import Anime, Comment, CustomUser, Episode, Genre, Report, UserEpisodes


class CustomRegisterSerializer(RegisterSerializer):
	email = serializers.EmailField(required=True)
	username = serializers.CharField(required=True)
	password1 = serializers.CharField(write_only=True, required=True)
	password2 = serializers.CharField(write_only=True, required=True)


class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ['id', 'username', 'first_name', 'last_name', 'email', 'avatar']
		read_only_fields = ['id', 'username']


class GenreSerializer(serializers.ModelSerializer):
	class Meta:
		model = Genre
		fields = ['id', 'name']


class AnimeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Anime
		fields = ('id', 'name', 'genres', 'image', 'thumbnail', 'description')

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


class SingleEpisodeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Episode
		fields = ['id', 'anime', 'number', 'views', 'liked']

	anime = AnimeSerializer()
	liked = serializers.SerializerMethodField()

	def get_liked(self, instance):

		request = self.context.get("request", None)
		if request and request.user and request.user.id:
			print("Single video request from USER")
			obj = UserEpisodes.objects.get_or_create(user_id=request.user.id, episode_id=instance.id)[0]
			return obj.liked
		return None


class MultiEpisodeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Episode
		fields = ['id', 'anime', 'number']

	anime = AnimeSerializer()


class SimpleMultiEpisodeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Episode
		fields = ['id', 'number']


class EpisodeCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Episode
		fields = ['id', 'anime', 'number', 'blogger_url']

	anime = serializers.PrimaryKeyRelatedField(queryset=Anime.objects.all())


class PlaylistSerializer(serializers.ModelSerializer):
	class Meta:
		model = Episode
		fields = ['id', 'title', 'description', 'image', 'thumbnail', 'sources']

	description = serializers.CharField(max_length=5000, source='anime.description')
	title = serializers.CharField(max_length=250, source='__str__')
	image = serializers.SerializerMethodField()
	thumbnail = serializers.SerializerMethodField()

	def get_image(self, episode):
		request = self.context.get('request')
		image_url = episode.anime.thumbnail.url
		return request.build_absolute_uri(image_url)

	def get_thumbnail(self, episode):
		request = self.context.get('request')
		image_url = episode.anime.image.url
		return request.build_absolute_uri(image_url)


class LikeSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserEpisodes
		fields = ['episode', 'liked']
		read_only_fields = ['episode']

	episode = serializers.PrimaryKeyRelatedField(queryset=Episode.objects.all())
	liked = serializers.BooleanField(required=False, allow_null=True)


class ReportSerializer(serializers.ModelSerializer):
	class Meta:
		model = Report
		fields = '__all__'


class SimpleAnimeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Anime
		fields = ["id", "name", "genres", "image"]

	genres = GenreSerializer(many=True)


class AnimeSearchSerializer(HaystackSerializerMixin, SimpleAnimeSerializer):
	class Meta(SimpleAnimeSerializer.Meta):
		search_fields = ("name",)


class CommentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Comment
		fields = ['id', 'user', 'text', 'replies']

	replies = serializers.ListSerializer(child=RecursiveField(), source="children", read_only=True)
