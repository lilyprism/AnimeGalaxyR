from random import randint
from typing import List

from django.core.cache import cache
from drf_haystack.viewsets import HaystackViewSet
from haystack.query import SearchQuerySet
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, BaseThrottle, UserRateThrottle

from .models import Anime, Comment, Episode, UserCommentRatings, UserEpisodes
from .paginators import StandardResultsSetPagination
from .serializers import AnimeSearchSerializer, AnimeSerializer, CommentLikeSerializer, CommentSerializer, CreateCommentSerializer, EpisodeCreateSerializer, EpisodeLikeSerializer, MultiEpisodeSerializer, PlaylistSerializer, ReportSerializer, SimpleMultiEpisodeSerializer, SingleEpisodeSerializer
from .throttles import LowAnonRateThrottle, LowUserRateThrottle, NormalUserRateThrottle


class BaseMVS(viewsets.ModelViewSet):
	# View Permissions
	permission_classes: List[BasePermission] = [IsAuthenticatedOrReadOnly]
	throttle_classes = [UserRateThrottle, AnonRateThrottle]

	# Serializers
	create_serializer = list_serializer = update_serializer = retrieve_serializer = None

	# Use Different Serializer For Create
	def create(self, request, *args, **kwargs):
		self.serializer_class = self.create_serializer or self.serializer_class
		return super(BaseMVS, self).create(request, *args, **kwargs)

	# Use Different Serializer For Retrieve
	def retrieve(self, request, *args, **kwargs):
		self.serializer_class = self.retrieve_serializer or self.serializer_class
		return super(BaseMVS, self).retrieve(request, *args, **kwargs)

	# Use Different Serializer For List
	def list(self, request, *args, **kwargs):
		self.serializer_class = self.list_serializer or self.serializer_class
		return super(BaseMVS, self).list(request, *args, **kwargs)

	# Use Different Serializer For Update
	def update(self, request, *args, **kwargs):
		self.serializer_class = self.update_serializer or self.serializer_class
		return super(BaseMVS, self).update(request, *args, **kwargs)

	# Handle Validation Errors
	def handle_exception(self, exc: Exception):
		if isinstance(exc, ValidationError):
			return Response({"error": {'message': exc.detail, 'code': 406}}, status.HTTP_406_NOT_ACCEPTABLE)

		return super(BaseMVS, self).handle_exception(exc)


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

	def comments(self, request, pk=None, *args, **kwargs):
		queryset = get_object_or_404(Episode, id=pk)

		serializer = CommentSerializer(queryset.comments.filter(parent=None), many=True, context={"request": request})
		return Response(serializer.data, status=status.HTTP_200_OK)

	@permission_classes([IsAuthenticated])
	def comment(self, request, pk=None, *args, **kwargs):
		self.check_permissions(request)

		queryset = get_object_or_404(Episode, id=pk)
		if not queryset:
			return Response(status=status.HTTP_400_BAD_REQUEST)

		# Prevent user spamming comments on same episode
		comment_count = Comment.objects.filter(user=request.user.id, episode=pk).count()
		if comment_count >= 5:
			raise ValidationError({"error": {"message": "User cannot comment more than 5 comments on the same episode!", "code": 19932}}, code=19932)

		# Set user to the user from the request and episode to the current episode page pk
		request.data["user"] = request.user.id
		request.data["episode"] = pk

		serializer = CreateCommentSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		serializer.save()

		return Response(serializer.data, status=status.HTTP_201_CREATED)


# noinspection PyMethodMayBeStatic
class AnimeView(BaseMVS):
	# Query options
	queryset = Anime.objects.all()
	serializer_class = AnimeSerializer
	throttle_classes: List[BaseThrottle] = []
	permission_classes: List[BasePermission] = []
	pagination_class = StandardResultsSetPagination

	def watched(self, request, *args, **kwargs):
		watched_list = cache.get("watched_animes") or []

		if len(watched_list) == 0:
			return Response([], status.HTTP_200_OK)

		queryset = Anime.objects.filter(pk__in=watched_list)[:8]
		serializer = AnimeSerializer(queryset, context={"request": request}, many=True)
		return Response(serializer.data, status.HTTP_200_OK)

	def latest(self, request, *args, **kwargs):
		queryset = Anime.objects.order_by("-pk")[:8]
		serializer = AnimeSerializer(queryset, context={"request": request}, many=True)
		return Response(serializer.data, status.HTTP_200_OK)

	def episodes(self, request, *args, **kwargs):
		queryset = self.get_object().episodes.order_by("-number")

		page = self.paginate_queryset(queryset)
		if page is not None:
			serializer = SimpleMultiEpisodeSerializer(page, context={"request": request}, many=True)
			return self.get_paginated_response(serializer.data)

		serializer = SimpleMultiEpisodeSerializer(queryset, context={"request": request}, many=True)
		return Response(serializer.data, status.HTTP_200_OK)

	def random(self, request, *args, **kwargs):
		count = Anime.objects.count()
		random_object = Anime.objects.all()[randint(0, count - 1)]

		return Response({"id": random_object.pk}, status.HTTP_200_OK)


class AnimeSearchView(HaystackViewSet):
	index_models = [Anime]
	throttle_classes: List[BaseThrottle] = []

	serializer_class = AnimeSearchSerializer

	def search(self, request, *args, **kwargs):
		text = request.query_params.get('text', None)

		if not text or 20 <= len(text) < 3:
			return Response({"details": "Invalid request!"}, status.HTTP_400_BAD_REQUEST)

		query = SearchQuerySet()
		query.query.set_limits(low=0, high=12)
		query1 = query.autocomplete(name__fuzzy=text)
		query2 = query.autocomplete(genres__fuzzy=text)
		query = query1 | query2

		serializer = AnimeSearchSerializer(query.query.get_results(), many=True, context={"request": request})
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

	def comment(self, request, *args, **kwargs):

		liked = request.data.get("liked", None)
		comment = request.data.get("comment", None)

		if not comment:
			raise ValidationError("Comment is not valid!")

		if liked is None:
			UserCommentRatings.objects.filter(user=request.user, comment_id=comment).delete()

			return Response({"details": "success"}, status.HTTP_202_ACCEPTED)
		else:
			instance = UserCommentRatings.objects.get_or_create(user=request.user, comment_id=comment, liked=liked)[0]

			instance.save()
			serializer = CommentLikeSerializer(instance=instance)

			return Response(serializer.data, status.HTTP_202_ACCEPTED)


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([LowUserRateThrottle, LowAnonRateThrottle])
def create_report(request, classifier):
	if not classifier:
		return Response(status=status.HTTP_400_BAD_REQUEST)

	request.data["classifier"] = classifier

	serializer = ReportSerializer(data=request.data)
	serializer.is_valid(raise_exception=True)
	serializer.save()

	return Response(serializer.data, status=status.HTTP_201_CREATED)
