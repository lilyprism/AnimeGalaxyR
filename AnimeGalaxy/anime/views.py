from random import randint
from typing import List

from django.core import exceptions
from django.core.cache import cache
from django.db.models import BooleanField, Case, Count, IntegerField, Sum, Value, When
from django.db.models.functions import Cast
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from drf_haystack.viewsets import HaystackViewSet
from haystack.query import SearchQuerySet
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from rest_framework.throttling import BaseThrottle

from main.paginators import AnimeListResultsSetPagination
from main.views import BaseMVS
from .models import Anime, Genre, UserAnimes
from .serializers import AnimeSearchSerializer, AnimeSerializer, ExtraAnimeSerializer, GenreSerializer


# noinspection PyMethodMayBeStatic
class AnimeView(BaseMVS):
	# Query options
	queryset = Anime.objects.all()
	serializer_class = AnimeSerializer
	throttle_classes: List[BaseThrottle] = []
	permission_classes: List[BasePermission] = []

	# @method_decorator(cache_page(1))
	# @method_decorator(vary_on_cookie)
	def retrieve(self, request, pk=None, *args, **kwargs):

		obj = get_object_or_404(Anime.objects.annotate(
				views=Sum("seasons__episodes__views"),
				completed=Sum(Cast("seasons__complete", IntegerField())),
				ongoing=Case(When(completed=0, then=Value(False)), default=Value(True), output_field=BooleanField())
		), id=pk)

		if request.user.id:
			self.queryset = UserAnimes.objects.get_or_create(user=request.user, anime_id=pk)[0]
			data = self.serializer_class(obj, context={"request": request}).data
			data["user_rating"] = self.queryset.rating
			return Response(data, status=status.HTTP_200_OK)

		data = self.serializer_class(obj, context={"request": request}).data
		return Response(data, status=status.HTTP_200_OK)

	def vote_anime_rating(self, request, pk=None, *args, **kwargs):
		if pk < 0:
			raise ValidationError("Invalid ID")

		if not request.user.id:
			return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

		rating = request.data.get("rating")
		if not rating:
			raise ValidationError("Rating should not be null!")

		try:
			rating = int(rating)
		except ValueError:
			raise ValidationError("Rating should be a number!")

		obj = UserAnimes.objects.get_or_create(user=request.user, anime_id=pk)[0]

		if obj.rating == rating:
			return Response(status=status.HTTP_200_OK)

		obj.rating = rating

		try:
			obj.clean_fields()
		except exceptions.ValidationError as err:
			raise ValidationError(err.messages[0])
		obj.save()

		return Response(status=status.HTTP_200_OK)

	@method_decorator(cache_page(60 * 1))
	def list(self, request, *args, **kwargs):
		self.serializer_class = ExtraAnimeSerializer
		self.pagination_class = AnimeListResultsSetPagination

		# Filters
		self.filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
		self.filterset_fields = ['genres']
		self.search_fields = ['^name']
		self.ordering_fields = ['name', 'id', 'views']

		self.queryset = Anime.objects.annotate(
				views=Sum("seasons__episodes__views"),
				episodes=Count("seasons__episodes")
		)

		# Enable searching for anime names that start with "special" characters
		if request.query_params.get("search") == "#":
			self.search_fields = []
			self.queryset = self.queryset.filter(name__iregex=r"^[^a-zA-Z].+")

		# Enable searching for anime names that start with "special" characters
		if "views" in request.query_params.get("ordering", ""):
			order = request.query_params.get("ordering", "")
			order = f"-{order}" if not order.startswith("-") else order[1:]
			self.queryset = self.queryset.order_by(order)

		return super(AnimeView, self).list(request, *args, **kwargs)

	@method_decorator(cache_page(60 * 1))
	def watched(self, request, *args, **kwargs):
		watched_list = cache.get("watched_animes") or []

		if len(watched_list) == 0:
			queryset = Anime.objects.all().annotate(
					views=Sum("seasons__episodes__views"),
					completed=Sum(Cast("seasons__complete", IntegerField())),
					ongoing=Case(When(completed=0, then=Value(False)), default=Value(True), output_field=BooleanField())
			).order_by("-views")[:8]
		else:
			queryset = Anime.objects.filter(pk__in=watched_list).annotate(
					views=Sum("seasons__episodes__views"),
					completed=Sum(Cast("seasons__complete", IntegerField())),
					ongoing=Case(When(completed=0, then=Value(False)), default=Value(True), output_field=BooleanField())
			).order_by("-views")[:8]

		serializer = AnimeSerializer(queryset, context={"request": request}, many=True)
		return Response(serializer.data, status.HTTP_200_OK)

	@method_decorator(cache_page(60 * 1))
	def latest(self, request, *args, **kwargs):
		queryset = Anime.objects.order_by("-pk").annotate(
				views=Sum("seasons__episodes__views"),
				completed=Sum(Cast("seasons__complete", IntegerField())),
				ongoing=Case(When(completed=0, then=Value(False)), default=Value(True), output_field=BooleanField())
		)[:8]
		serializer = AnimeSerializer(queryset, context={"request": request}, many=True)
		return Response(serializer.data, status.HTTP_200_OK)

	def random(self, request, *args, **kwargs):
		count = Anime.objects.count()
		random_object = Anime.objects.all()[randint(0, count - 1)]

		return Response({"id": random_object.pk}, status.HTTP_200_OK)


class GenreView(BaseMVS):
	serializer_class = GenreSerializer
	queryset = Genre.objects.all()

	@method_decorator(cache_page(60 * 30))
	def list(self, request, *args, **kwargs):
		return super(GenreView, self).list(request, *args, **kwargs)


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
