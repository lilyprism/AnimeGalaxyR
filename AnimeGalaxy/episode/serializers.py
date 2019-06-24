from rest_framework import serializers

from anime.models import Anime
from anime.serializers import AnimeSerializer, GenrelessAnimeSerializer
from .models import Episode, UserEpisodes


class SingleEpisodeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Episode
		fields = ['id', 'anime', 'number', 'views', 'liked', 'likes', 'dislikes']

	anime = AnimeSerializer()
	liked = serializers.SerializerMethodField()
	likes = serializers.SerializerMethodField()
	dislikes = serializers.SerializerMethodField()

	def get_likes(self, instance):
		return UserEpisodes.objects.filter(episode_id=instance.id, liked=True).count()

	def get_dislikes(self, instance):
		return UserEpisodes.objects.filter(episode_id=instance.id, liked=False).count()

	def get_liked(self, instance):

		request = self.context.get("request", None)
		if request and request.user and request.user.id:
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


class EpisodeLikeSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserEpisodes
		fields = ['episode', 'liked']
		read_only_fields = ['episode']

	episode = serializers.PrimaryKeyRelatedField(queryset=Episode.objects.all())
	liked = serializers.BooleanField(required=False, allow_null=True)


class UserProfileEpisodeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Episode
		fields = ['id', 'number', 'anime']

	anime = GenrelessAnimeSerializer()


class UserProfileUserEpisodeSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserEpisodes
		fields = ['episode', 'liked', 'date']

	episode = UserProfileEpisodeSerializer()
