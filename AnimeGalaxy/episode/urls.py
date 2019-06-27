from django.urls import include, path

from . import views

urlpatterns = [
	path('like', views.LikeView.as_view({"post": "episode"}), name="like-video"),
	path('favorite', views.LikeView.as_view({"post": "favorite"}), name="favorite-video"),
	path('watch-later', views.LikeView.as_view({"post": "watch_later"}), name="watch-later-video"),
	path('latest', views.EpisodesView.as_view({"get": "list", "post": "create"}), name='list-episodes'),
	path('<int:pk>', views.EpisodesView.as_view({"get": "retrieve"}), name='retrieve-episode'),

	path('playlist/<int:pk>', views.UrlView.as_view({"get": "retrieve"}), name='retrieve-urls'),

	path('', include('comment.urls'))
]
