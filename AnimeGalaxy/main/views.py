from typing import List

from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle

from .serializers import ReportSerializer
from .throttles import LowAnonRateThrottle, LowUserRateThrottle


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
