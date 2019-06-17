from django.urls import path

from . import views

urlpatterns = [
	path('<int:pk>/comments', views.CommentsView.as_view({"get": "comments"}), name="episode-comments"),
	path('<int:pk>/comment', views.CommentsView.as_view({"post": "comment"}), name="episode-comment"),
	path('comment/like', views.LikeView.as_view({"post": "comment"}), name="like-comment"),
]
