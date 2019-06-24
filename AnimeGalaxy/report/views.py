from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from main.throttles import LowAnonRateThrottle, LowUserRateThrottle
from .serializers import ReportSerializer


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
