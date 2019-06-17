from main.serializers import SimpleUserSerializer
from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField

from .models import Comment, UserCommentRatings


class CommentLikeSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserCommentRatings
		fields = ['comment', 'liked']
		read_only_fields = ['comment']

	comment = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all())
	liked = serializers.BooleanField(required=True, allow_null=False)


class CreateCommentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Comment
		fields = ['id', 'user', 'episode', 'text', 'parent']


class CommentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Comment
		fields = ['id', 'user', 'text', 'level', 'liked', 'date', 'replies', 'likes', 'dislikes']

	replies = serializers.ListSerializer(child=RecursiveField(), source="children", read_only=True)
	user = SimpleUserSerializer()
	liked = serializers.SerializerMethodField()
	likes = serializers.SerializerMethodField()
	dislikes = serializers.SerializerMethodField()

	def get_likes(self, instance):
		return UserCommentRatings.objects.filter(comment_id=instance.id, liked=True).count()

	def get_dislikes(self, instance):
		return UserCommentRatings.objects.filter(comment_id=instance.id, liked=False).count()

	def get_liked(self, instance):

		request = self.context.get("request", None)
		if request and request.user and request.user.id:
			objs = UserCommentRatings.objects.filter(user_id=request.user.id, comment_id=instance.id)
			return objs[0].liked if len(objs) > 0 else None
		return None
