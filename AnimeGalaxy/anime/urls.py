from django.urls import path

from episode import views as episode_views
from . import views

urlpatterns = [
	path('search', views.AnimeSearchView.as_view({"get": "search"}), name="search-anime"),
	path('list', views.AnimeView.as_view({"get": "list"}), name="list-anime"),
	path('random', views.AnimeView.as_view({"get": "random"}), name="random-anime"),
	path('latest', views.AnimeView.as_view({"get": "latest"}), name="latest-anime"),
	path('watched', views.AnimeView.as_view({"get": "watched"}), name="watched-anime"),
	path('<int:pk>', views.AnimeView.as_view({"get": "retrieve"}), name="get-anime"),
	path('<int:pk>/episodes', episode_views.EpisodesView.as_view({"get": "episodes"}), name="episodes-anime"),
]
