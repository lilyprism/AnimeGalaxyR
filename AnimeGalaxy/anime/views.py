from random import randint
from typing import List

from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from drf_haystack.viewsets import HaystackViewSet
from haystack.query import SearchQuerySet
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from rest_framework.throttling import BaseThrottle

from main.paginators import AnimeListResultsSetPagination
from main.views import BaseMVS
from .models import Anime, Genre
from .serializers import AnimeSearchSerializer, AnimeSerializer, ExtraAnimeSerializer, GenreSerializer


# noinspection PyMethodMayBeStatic
class AnimeView(BaseMVS):
	# Query options
	queryset = Anime.objects.all()
	serializer_class = AnimeSerializer
	throttle_classes: List[BaseThrottle] = []
	permission_classes: List[BasePermission] = []

	@method_decorator(cache_page(60 * 1))
	def list(self, request, *args, **kwargs):
		self.serializer_class = ExtraAnimeSerializer
		self.pagination_class = AnimeListResultsSetPagination

		# Filters
		self.filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
		self.filterset_fields = ['genres']
		self.search_fields = ['^name']
		self.ordering_fields = ['name', 'id']

		# Enable searching for anime names that start with "special" characters
		if request.query_params.get("search") == "#":
			self.search_fields = []
			self.queryset = Anime.objects.filter(name__iregex=r"^[^a-zA-Z].+")

		return super(AnimeView, self).list(request, *args, **kwargs)

	@method_decorator(cache_page(60 * 1))
	def watched(self, request, *args, **kwargs):
		watched_list = cache.get("watched_animes") or []

		if len(watched_list) == 0:
			return Response([], status.HTTP_200_OK)

		queryset = Anime.objects.filter(pk__in=watched_list).order_by("-id")[:8]
		serializer = AnimeSerializer(queryset, context={"request": request}, many=True)
		return Response(serializer.data, status.HTTP_200_OK)

	@method_decorator(cache_page(60 * 1))
	def latest(self, request, *args, **kwargs):
		queryset = Anime.objects.order_by("-pk")[:6]
		serializer = AnimeSerializer(queryset, context={"request": request}, many=True)
		return Response(serializer.data, status.HTTP_200_OK)

	def random(self, request, *args, **kwargs):
		count = Anime.objects.count()
		random_object = Anime.objects.all()[randint(0, count - 1)]

		return Response({"id": random_object.pk}, status.HTTP_200_OK)


class GenreView(BaseMVS):
	serializer_class = GenreSerializer
	queryset = Genre.objects.all()


class AnimeSearchView(HaystackViewSet):
	index_models = [Anime]
	throttle_classes: List[BaseThrottle] = []

	serializer_class = AnimeSearchSerializer

	@method_decorator(cache_page(60 * 1))
	def search(self, request, *args, **kwargs):
		text = request.query_params.get('text', None)

		if not text or len(text) < 3 or len(text) >= 60:
			return Response({"details": "Invalid request!"}, status.HTTP_400_BAD_REQUEST)

		sqs = SearchQuerySet()
		sqs.query.set_limits(low=0, high=12)
		auto = sqs.autocomplete(name__fuzzy=text)
		sqs = auto

		serializer = AnimeSearchSerializer(sqs.query.get_results(), many=True, context={"request": request})
		return Response(serializer.data, status.HTTP_200_OK)
