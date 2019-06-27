from django.contrib import admin
from mptt.admin import DraggableMPTTAdmin

from .models import Comment, UserCommentRatings


@admin.register(Comment)
class CommentAdmin(DraggableMPTTAdmin):
	list_filter = ['episode__season']


@admin.register(UserCommentRatings)
class UserCommentRatingsAdmin(admin.ModelAdmin):
	pass
