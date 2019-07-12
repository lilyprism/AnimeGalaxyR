from rest_framework import serializers

from anime.models import Season
from anime.serializers import SeasonSerializer, SimpleSeasonSerializer
from .models import Episode, UserEpisodes


class SingleEpisodeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Episode
		fields = ['id', 'season', 'number', 'views', 'liked', 'likes', 'dislikes', 'gif', 'image']

	season = SeasonSerializer()
	liked = serializers.SerializerMethodField()
	likes = serializers.SerializerMethodField()
	dislikes = serializers.SerializerMethodField()
	gif = serializers.SerializerMethodField()
	image = serializers.SerializerMethodField()

	def get_image(self, episode):
		request = self.context.get('request')
		image_url = episode.image.url
		return request.build_absolute_uri(image_url)

	def get_gif(self, episode):
		request = self.context.get('request')
		image_url = episode.gif.url
		return request.build_absolute_uri(image_url)

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
		fields = ['id', 'number', 'added', 'favorite', 'watch_later', 'season', 'gif', 'image']

	season = SimpleSeasonSerializer()
	favorite = serializers.SerializerMethodField()
	watch_later = serializers.SerializerMethodField()
	gif = serializers.SerializerMethodField()
	image = serializers.SerializerMethodField()

	def get_image(self, episode):
		request = self.context.get('request')
		image_url = episode.image.url
		return request.build_absolute_uri(image_url)

	def get_gif(self, episode):
		request = self.context.get('request')
		image_url = episode.gif.url
		return request.build_absolute_uri(image_url)

	def get_favorite(self, instance):
		request = self.context.get("request", None)

		if not request:
			raise ValueError("Request is null")

		user_episode = UserEpisodes.objects.filter(episode=instance.id).first()
		return user_episode.favorite if user_episode else False

	def get_watch_later(self, instance):
		request = self.context.get("request", None)

		if not request:
			raise ValueError("Request is null")

		user_episode = UserEpisodes.objects.filter(episode=instance.id).first()
		return user_episode.watch_later if user_episode else False


class SimpleMultiEpisodeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Episode
		fields = ['id', 'number', 'gif', 'image']

	gif = serializers.SerializerMethodField()
	image = serializers.SerializerMethodField()

	def get_image(self, episode):
		request = self.context.get('request')
		image_url = episode.image.url
		return request.build_absolute_uri(image_url)

	def get_gif(self, episode):
		request = self.context.get('request')
		image_url = episode.gif.url
		return request.build_absolute_uri(image_url)


class EpisodeCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Episode
		fields = ['id', 'season', 'number', 'blogger_url']

	season = serializers.PrimaryKeyRelatedField(queryset=Season.objects.all())


class PlaylistSerializer(serializers.ModelSerializer):
	class Meta:
		model = Episode
		fields = ['id', 'title', 'description', 'image', 'thumbnail', 'sources']

	description = serializers.CharField(max_length=5000, source='season.anime.description')
	title = serializers.CharField(max_length=250, source='__str__')
	image = serializers.SerializerMethodField()
	thumbnail = serializers.SerializerMethodField()

	def get_image(self, episode):
		request = self.context.get('request')
		image_url = episode.image.url or episode.season.anime.thumbnail
		return request.build_absolute_uri(image_url)

	def get_thumbnail(self, episode):
		request = self.context.get('request')
		image_url = episode.season.anime.image.url
		return request.build_absolute_uri(image_url)


class EpisodeLikeSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserEpisodes
		fields = ['episode', 'liked', 'favorite', 'watch_later']
		read_only_fields = ['episode']

	episode = serializers.PrimaryKeyRelatedField(queryset=Episode.objects.all())
	liked = serializers.BooleanField(required=False, allow_null=True)


class UserProfileEpisodeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Episode
		fields = ['id', 'number', 'season']

	season = SeasonSerializer()


class UserProfileUserEpisodeSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserEpisodes
		fields = ['episode', 'liked', 'date']

	episode = UserProfileEpisodeSerializer()


class SeasonEpisodeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Season
		fields = ['id', 'number', 'episodes']

	episodes = SimpleMultiEpisodeSerializer(many=True)
