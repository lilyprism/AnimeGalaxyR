from rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers

from .models import Anime, CustomUser, Episode, Genre, Quality, Video


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


class EpisodeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Episode
		fields = ['id', 'anime', 'number', 'views']

	anime = AnimeSerializer()


class EpisodeCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Episode
		fields = ['id', 'anime', 'number']

	anime = serializers.PrimaryKeyRelatedField(queryset=Anime.objects.all())


class QualitySerializer(serializers.ModelSerializer):
	class Meta:
		model = Quality
		fields = ['id', 'name']


class VideoCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Video
		fields = ["id", "quality", "url", "episode"]

	quality = serializers.PrimaryKeyRelatedField(queryset=Quality.objects.all())
	episode = serializers.PrimaryKeyRelatedField(queryset=Episode.objects.all())


class VideoSerializer(serializers.ModelSerializer):
	class Meta:
		model = Video
		fields = ['id', 'quality', 'url']

	quality = QualitySerializer()


class PlaylistSerializer(serializers.ModelSerializer):
	class Meta:
		model = Episode
		fields = ['id', 'title', 'description', 'image', 'sources']

	description = serializers.CharField(max_length=5000, source='anime.description')
	title = serializers.CharField(max_length=250, source='__str__')
	image = serializers.SerializerMethodField()
	sources = serializers.SerializerMethodField()

	def get_sources(self, episode):
		request = self.context.get('request')
		return [{"file": request.build_absolute_uri(e.video.url), "label": e.quality.name, "default": True if e.quality.name == "HD" else False, "type": "video/mp4"} for e in episode.videos.all()]

	def get_image(self, episode):
		request = self.context.get('request')
		image_url = episode.anime.thumbnail.url
		return request.build_absolute_uri(image_url)
