from django.urls import path

from . import views

urlpatterns = [
	path('episodes', views.EpisodesView.as_view({"get": "list", "post": "create"}), name='list-episodes'),
	path('videos', views.VideoView.as_view({"post": "create"}), name='list-videos'),
	path('videos/<int:pk>', views.EpisodesView.as_view({"get": "retrieve"}), name='retrieve-episode'),
	path('playlist/<int:pk>', views.UrlView.as_view({"get": "retrieve"}), name='retrieve-urls'),
]
