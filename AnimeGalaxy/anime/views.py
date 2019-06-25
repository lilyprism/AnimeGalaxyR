from random import randint
from typing import List

from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from drf_haystack.viewsets import HaystackViewSet
from haystack.query import SearchQuerySet
from rest_framework import status
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from rest_framework.throttling import BaseThrottle

from main.views import BaseMVS
from .models import Anime
from .serializers import AnimeSearchSerializer, AnimeSerializer


# noinspection PyMethodMayBeStatic
class AnimeView(BaseMVS):
	# Query options
	queryset = Anime.objects.all()
	serializer_class = AnimeSerializer
	throttle_classes: List[BaseThrottle] = []
	permission_classes: List[BasePermission] = []

	@method_decorator(cache_page(60 * 1))
	def watched(self, request, *args, **kwargs):
		watched_list = cache.get("watched_animes") or []
		
		if len(watched_list) == 0:
			return Response([], status.HTTP_200_OK)

		queryset = Anime.objects.filter(pk__in=watched_list)[:8]
		serializer = AnimeSerializer(queryset, context={"request": request}, many=True)
		return Response(serializer.data, status.HTTP_200_OK)

	@method_decorator(cache_page(60 * 1))
	def latest(self, request, *args, **kwargs):
		queryset = Anime.objects.order_by("-pk")[:8]
		serializer = AnimeSerializer(queryset, context={"request": request}, many=True)
		return Response(serializer.data, status.HTTP_200_OK)

	def random(self, request, *args, **kwargs):
		count = Anime.objects.count()
		random_object = Anime.objects.all()[randint(0, count - 1)]

		return Response({"id": random_object.pk}, status.HTTP_200_OK)


class AnimeSearchView(HaystackViewSet):
	index_models = [Anime]
	throttle_classes: List[BaseThrottle] = []

	serializer_class = AnimeSearchSerializer

	@method_decorator(cache_page(60 * 1))
	def search(self, request, *args, **kwargs):
		text = request.query_params.get('text', None)

		if not text or len(text) < 3 or len(text) >= 60:
			return Response({"details": "Invalid request!"}, status.HTTP_400_BAD_REQUEST)

		query = SearchQuerySet()
		query.query.set_limits(low=0, high=12)
		query1 = query.autocomplete(name__fuzzy=text)
		query = query1

		serializer = AnimeSearchSerializer(query.query.get_results(), many=True, context={"request": request})
		return Response(serializer.data, status.HTTP_200_OK)
