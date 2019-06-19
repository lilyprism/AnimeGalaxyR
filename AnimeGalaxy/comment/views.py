from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from episode.models import Episode
from main.throttles import NormalUserRateThrottle
from main.views import BaseMVS
from .models import Comment, UserCommentRatings
from .serializers import CommentLikeSerializer, CommentSerializer, CreateCommentSerializer


class CommentsView(BaseMVS):
	@method_decorator(cache_page(60 * 2))
	def comments(self, request, pk=None, *args, **kwargs):
		queryset = get_object_or_404(Episode, id=pk)

		serializer = CommentSerializer(queryset.comments.filter(parent=None).order_by("-date"), many=True, context={"request": request})
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


class LikeView(BaseMVS):
	permission_classes = [IsAuthenticated]
	throttle_classes = [NormalUserRateThrottle]
	queryset = UserCommentRatings.objects.all()

	def comment(self, request, *args, **kwargs):

		liked = request.data.get("liked", None)
		comment = request.data.get("comment", None)

		if not comment:
			raise ValidationError("Comment is not valid!")

		if liked is None:
			UserCommentRatings.objects.filter(user=request.user, comment_id=comment).delete()

			return Response({"details": "success"}, status.HTTP_202_ACCEPTED)
		else:
			instance = UserCommentRatings.objects.get_or_create(user=request.user, comment_id=comment)[0]
			instance.liked = liked

			instance.save()
			serializer = CommentLikeSerializer(instance=instance)

			return Response(serializer.data, status.HTTP_202_ACCEPTED)
