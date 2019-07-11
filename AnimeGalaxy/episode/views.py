from typing import List

from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import BaseThrottle

from anime.models import Anime
from main.paginators import HomeResultsSetPagination
from main.views import BaseMVS
from .models import Episode, UserEpisodes
from .serializers import EpisodeCreateSerializer, EpisodeLikeSerializer, MultiEpisodeSerializer, PlaylistSerializer, SeasonEpisodeSerializer, SingleEpisodeSerializer


class EpisodesView(BaseMVS):
	# Query Options
	queryset = Episode.objects.all().order_by("-pk")
	serializer_class = MultiEpisodeSerializer
	create_serializer = EpisodeCreateSerializer
	throttle_classes: List[BaseThrottle] = []

	filterset_fields = ('id',)

	def retrieve(self, request, pk=None, *args, **kwargs):
		queryset = get_object_or_404(Episode, id=pk)

		# Increment view number
		queryset.views += 1
		queryset.save()

		# TODO(sayga231): Change this to another API Endpoint with better control over time watched
		if request.user.id:
			user_episode = queryset.user_episodes.get_or_create(episode_id=pk, user=request.user)[0]
			user_episode.watched = True
			user_episode.save()

		# Set anime to currently being watched
		watched = cache.get("watched_animes") or []
		if queryset.season.anime_id not in watched:
			watched.append(queryset.season.anime_id)
			cache.set("watched_animes", watched, timeout=60 * 60)

		# Send episode information
		serializer = SingleEpisodeSerializer(queryset, many=False, context={'request': request})
		return Response(serializer.data, status=status.HTTP_200_OK)

	@method_decorator(cache_page(60 * 1))
	def list(self, request, *args, **kwargs):
		self.pagination_class = HomeResultsSetPagination
		return super(EpisodesView, self).list(request, *args, **kwargs)

	@method_decorator(cache_page(60 * 1))
	def episodes(self, request, pk=None, *args, **kwargs):
		queryset = get_object_or_404(Anime, id=pk).seasons.order_by("-number")
		serializer = SeasonEpisodeSerializer(queryset, context={"request": request}, many=True)
		return Response(serializer.data, status.HTTP_200_OK)


class UrlView(BaseMVS):
	# Query Options
	throttle_classes: List[BaseThrottle] = []
	queryset = Episode.objects.all()
	serializer_class = PlaylistSerializer

	@method_decorator(cache_page(60 * 15))
	def retrieve(self, request, pk=None, *args, **kwargs):
		requested_episode = Episode.objects.get(pk=pk)
		if not requested_episode:
			return Response(status=status.HTTP_404_NOT_FOUND)

		episodes = Episode.objects.filter(season=requested_episode.season, number__gte=requested_episode.number).order_by("number")[:12]
		serializer = PlaylistSerializer(episodes, many=True, context={"request": request})
		return Response(serializer.data, status=status.HTTP_200_OK)


class LikeView(BaseMVS):
	permission_classes = [IsAuthenticated]
	throttle_classes: List[BaseThrottle] = []
	queryset = UserEpisodes.objects.all()
	serializer_class = EpisodeLikeSerializer

	def episode(self, request, *args, **kwargs):

		if not request.data.get("episode", None):
			raise ValidationError("Episode is not valid!")

		liked = request.data.get("liked", None)

		instance = UserEpisodes.objects.get_or_create(user=request.user, episode_id=request.data["episode"])[0]
		instance.liked = liked

		instance = self.delete_or_save(instance)
		serializer = EpisodeLikeSerializer(instance=instance)

		return Response(serializer.data)

	def favorite(self, request, *args, **kwargs):

		if not request.data.get("episode", None):
			raise ValidationError("Episode is not valid!")

		instance = UserEpisodes.objects.get_or_create(user=request.user, episode_id=request.data["episode"])[0]
		instance.favorite = not instance.favorite

		instance = self.delete_or_save(instance)
		serializer = EpisodeLikeSerializer(instance=instance)

		return Response(serializer.data)

	def watch_later(self, request, *args, **kwargs):

		if not request.data.get("episode", None):
			raise ValidationError("Episode is not valid!")

		instance = UserEpisodes.objects.get_or_create(user=request.user, episode_id=request.data["episode"])[0]
		instance.watch_later = not instance.watch_later

		instance = self.delete_or_save(instance)
		serializer = EpisodeLikeSerializer(instance=instance)

		return Response(serializer.data)

	@staticmethod
	def delete_or_save(instance: UserEpisodes) -> UserEpisodes:
		if not instance.watch_later and not instance.favorite and instance.liked is None and not instance.watched:
			instance.delete()
		else:
			instance.save()
		return instance
