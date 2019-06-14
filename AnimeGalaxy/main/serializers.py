from drf_haystack.serializers import HaystackSerializerMixin
from rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField

from .models import Anime, Comment, CustomUser, Episode, Genre, Report, UserCommentRatings, UserEpisodes


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

	def get_avatar(self, instance):
		request = self.context.get('request')
		image_url = instance.avatar.url
		return request.build_absolute_uri(image_url)


class SimpleUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ['id', 'username', 'avatar']

	def get_avatar(self, instance):
		request = self.context.get('request')
		image_url = instance.avatar.url
		return request.build_absolute_uri(image_url)


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


class CommentLikeSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserCommentRatings
		fields = ['comment', 'liked']
		read_only_fields = ['comment']

	comment = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all())
	liked = serializers.BooleanField(required=True, allow_null=False)


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


class CreateCommentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Comment
		fields = ['id', 'user', 'episode', 'text', 'parent']


class CommentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Comment
		fields = ['id', 'user', 'text', 'level', 'liked', 'date', 'replies', 'likes', 'dislikes']

	replies = serializers.ListSerializer(child=RecursiveField(), source="children", read_only=True)
	user = SimpleUserSerializer()
	liked = serializers.SerializerMethodField()
	likes = serializers.SerializerMethodField()
	dislikes = serializers.SerializerMethodField()

	def get_likes(self, instance):
		return UserCommentRatings.objects.filter(comment_id=instance.id, liked=True).count()

	def get_dislikes(self, instance):
		return UserCommentRatings.objects.filter(comment_id=instance.id, liked=False).count()

	def get_liked(self, instance):

		request = self.context.get("request", None)
		if request and request.user and request.user.id:
			objs = UserCommentRatings.objects.filter(user_id=request.user.id, comment_id=instance.id)
			return objs[0].liked if len(objs) > 0 else None
		return None
