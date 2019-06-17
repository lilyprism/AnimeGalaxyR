from typing import List

from anime.models import Anime
from django.core.cache import cache
from main.paginators import StandardResultsSetPagination
from main.throttles import NormalUserRateThrottle
from main.views import BaseMVS
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import BaseThrottle

from .models import Episode, UserEpisodes
from .serializers import EpisodeCreateSerializer, EpisodeLikeSerializer, MultiEpisodeSerializer, PlaylistSerializer, SimpleMultiEpisodeSerializer, SingleEpisodeSerializer


class EpisodesView(BaseMVS):
	# Query Options
	queryset = Episode.objects.all().order_by("-pk")[:12]
	serializer_class = MultiEpisodeSerializer
	create_serializer = EpisodeCreateSerializer
	throttle_classes: List[BaseThrottle] = []

	filterset_fields = ('id',)

	def retrieve(self, request, pk=None, *args, **kwargs):
		queryset = get_object_or_404(Episode, id=pk)

		# Increment view number
		queryset.views += 1
		queryset.save()

		# Set anime to currently being watched
		watched = cache.get("watched_animes") or []
		if queryset.anime_id not in watched:
			watched.append(queryset.anime_id)
			cache.set("watched_animes", watched, timeout=60 * 60)

		# Send episode information
		serializer = SingleEpisodeSerializer(queryset, many=False, context={'request': request})
		return Response(serializer.data, status=status.HTTP_200_OK)

	def episodes(self, request, pk=None, *args, **kwargs):
		self.pagination_class = StandardResultsSetPagination
		queryset = get_object_or_404(Anime, id=pk).episodes.order_by("-number")

		page = self.paginate_queryset(queryset)
		if page is not None:
			serializer = SimpleMultiEpisodeSerializer(page, context={"request": request}, many=True)
			return self.get_paginated_response(serializer.data)

		serializer = SimpleMultiEpisodeSerializer(queryset, context={"request": request}, many=True)
		return Response(serializer.data, status.HTTP_200_OK)


class UrlView(BaseMVS):
	# Query Options
	throttle_classes: List[BaseThrottle] = []
	queryset = Episode.objects.all()
	serializer_class = PlaylistSerializer

	def retrieve(self, request, pk=None, *args, **kwargs):
		requested_episode = Episode.objects.get(pk=pk)
		if not requested_episode:
			return Response(status=status.HTTP_404_NOT_FOUND)

		episodes = Episode.objects.filter(anime=requested_episode.anime, number__gte=requested_episode.number).order_by("number")[:12]
		serializer = PlaylistSerializer(episodes, many=True, context={"request": request})
		return Response(serializer.data, status=status.HTTP_200_OK)


class LikeView(BaseMVS):
	permission_classes = [IsAuthenticated]
	throttle_classes = [NormalUserRateThrottle]
	queryset = UserEpisodes.objects.all()

	def episode(self, request, *args, **kwargs):

		if not request.data.get("episode", None):
			raise ValidationError("Episode is not valid!")

		liked = request.data.get("liked", None)

		instance = UserEpisodes.objects.get_or_create(user=request.user, episode=request.data["episode"])[0]
		instance.liked = liked

		instance.save()
		serializer = EpisodeLikeSerializer(instance=instance)

		return Response(serializer.data)
