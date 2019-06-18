from django.urls import include, path
from rest_auth.registration.views import RegisterView
from rest_auth.views import LoginView, LogoutView

from .views import UserChangeView

urlpatterns = [
	# Authentication
	path('auth/login', LoginView.as_view(), name='rest_login'),
	path('auth/logout', LogoutView.as_view(), name='rest_logout'),
	path('auth/register', RegisterView.as_view(), name='rest_register'),
	path('auth/user', UserChangeView.as_view(), name='rest_user_profile'),

	# App related
	path('report/', include('report.urls')),
	path('episode/', include('episode.urls')),
	path('anime/', include('anime.urls')),
]
