from django.contrib import admin
from mptt.admin import DraggableMPTTAdmin

from .models import Comment


@admin.register(Comment)
class CommentAdmin(DraggableMPTTAdmin):
	list_filter = ['episode__anime']
