from django.urls import include, path
from rest_auth.registration.views import RegisterView
from rest_auth.views import LoginView, LogoutView

from . import views

urlpatterns = [
	# Authentication
	path('auth/login', LoginView.as_view(), name='rest_login'),
	path('auth/logout', LogoutView.as_view(), name='rest_logout'),
	path('auth/register', RegisterView.as_view(), name='rest_register'),

	# Reports
	path('report/video', views.create_report, {"classifier": "video-report"}, name="create-video-report"),
	path('report/video/other', views.create_report, {"classifier": "video-report-other"}, name="create-report"),
	path('report/comment/spoiler', views.create_report, {"classifier": "comment-report-spoiler"}, name="comment-spoiler"),
	path('report/comment/offensive', views.create_report, {"classifier": "comment-report-offensive"}, name="comment-report-offensive"),

	# Episode Related
	path('episode/', include('episode.urls')),

	# Anime Related
	path('anime/', include('anime.urls')),
]
