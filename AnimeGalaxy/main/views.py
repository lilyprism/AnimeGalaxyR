from typing import List

from PIL import Image
from django.contrib.auth import get_user_model
from rest_framework import status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.generics import RetrieveUpdateAPIView, get_object_or_404
from rest_framework.parsers import FileUploadParser
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle

from episode.models import UserEpisodes
from episode.serializers import UserProfileUserEpisodeSerializer
from main.models import CustomUser
from .serializers import UserSerializer


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


class ImageUploadParser(FileUploadParser):
	media_type = 'image/*'


class ProfileView(BaseMVS):
	permission_classes = [AllowAny]
	queryset = CustomUser

	def details(self, request, pk=None, *args, **kwargs):
		if not pk and not request.user:
			return Response("", status.HTTP_405_METHOD_NOT_ALLOWED)

		user_id = pk if pk else request.user.id
		return self.get_user_details(user_id, request)

	@staticmethod
	def get_user_details(user_id: int, request):
		# Last Episodes Watched
		last_seen = UserEpisodes.objects.order_by("-date").filter(user=user_id)[:10]

		# Animes Currently Watching
		watch_episodes = UserEpisodes.objects.filter(user=user_id, watched=True).distinct("episode__anime__id").order_by("episode__anime__id", "-episode__number")

		# TODO(sayga231): Get complete and watching with queries to have more control and make it more efficient
		complete = [anime for anime in watch_episodes if anime.episode.number >= anime.episode.anime.episodes.count()]
		watching = [anime for anime in watch_episodes if anime.episode.number < anime.episode.anime.episodes.count()]

		user = get_object_or_404(CustomUser, pk=user_id)

		user_data = UserSerializer(user, context={"request": request}).data
		seen_data = UserProfileUserEpisodeSerializer(last_seen, many=True, context={"request": request}).data
		watch_data = UserProfileUserEpisodeSerializer(watching, many=True, context={"request": request}).data
		comp_data = UserProfileUserEpisodeSerializer(complete, many=True, context={"request": request}).data

		# Other stats
		finished_animes = len(complete)
		# TODO(sayga231): Track player time and save on DB to get a better estimate and resume video times
		time_watched = UserEpisodes.objects.filter(user=user_id).count() * 20

		return Response({"animes_finished": finished_animes, "time_watched": time_watched, "user": user_data, "last_seen": seen_data, "watching": watch_data, "complete": comp_data})


class UserChangeView(RetrieveUpdateAPIView):
	parser_class = (ImageUploadParser,)

	serializer_class = UserSerializer
	permission_classes = [IsAuthenticated]

	def get_object(self):
		return self.request.user

	def get_queryset(self):
		return get_user_model().objects.none()

	def put(self, request: Request, format=None, **kwargs):

		# Validate avatar image and save it
		if 'avatar' in request.data.items():
			f = request.data['avatar']

			try:
				img = Image.open(f)
				img.verify()
			except (IOError,):
				raise ValidationError("Unsupported image type")

			self.request.user.avatar.save(f.name, f, True)

		return super(UserChangeView, self).put(request, format, **kwargs)
