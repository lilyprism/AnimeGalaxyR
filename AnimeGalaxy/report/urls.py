from django.urls import path

from . import views

urlpatterns = [
	path('video', views.create_report, {"classifier": "video-report"}, name="create-video-report"),
	path('video/other', views.create_report, {"classifier": "video-report-other"}, name="create-report"),
	path('comment/spoiler', views.create_report, {"classifier": "comment-report-spoil"}, name="comment-spoiler"),
	path('comment/offensive', views.create_report, {"classifier": "comment-report-off"}, name="comment-report-offensive"),
]
