from typing import List

from rest_framework import status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import BasePermission, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle

from .models import Episode, Video
from .serializers import EpisodeCreateSerializer, EpisodeSerializer, PlaylistSerializer, VideoCreateSerializer


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
		return super(BaseMVS, self).create(request, *args, **kwargs)

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
	serializer_class = EpisodeSerializer
	create_serializer = EpisodeCreateSerializer

	filterset_fields = ('id',)

	def retrieve(self, request, pk=None, *args, **kwargs):
		queryset = get_object_or_404(Episode, id=pk)
		if not queryset:
			return Response(status=status.HTTP_400_BAD_REQUEST)
		else:
			serializer = EpisodeSerializer(queryset, many=False)
			return Response(serializer.data, status=status.HTTP_200_OK)


class VideoView(BaseMVS):
	create_serializer = VideoCreateSerializer


class UrlView(BaseMVS):
	# Query Options
	queryset = Video.objects.all()
	serializer_class = PlaylistSerializer

	def retrieve(self, request, pk=None, *args, **kwargs):
		requested_episode = Episode.objects.get(pk=pk)
		if not requested_episode:
			return Response(status=status.HTTP_404_NOT_FOUND)
		else:
			episodes = Episode.objects.filter(anime=requested_episode.anime, number__gte=requested_episode.number)
			serializer = PlaylistSerializer(episodes, many=True, context={"request": request})
			return Response(serializer.data, status=status.HTTP_200_OK)
