import os

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.files.storage import FileSystemStorage
from django.db import models
from django.db.models import Model

anime_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'animes'), base_url=os.path.join(settings.MEDIA_URL, 'animes'))
episode_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'episodes'), base_url=os.path.join(settings.MEDIA_URL, 'episodes'))
user_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'users'), base_url=os.path.join(settings.MEDIA_URL, 'users'))


class Genre(Model):
	# Meta configurations
	class Meta:
		verbose_name = 'Género'

	name = models.CharField(max_length=50, null=False, blank=False, unique=True)

	def __str__(self) -> str:
		return self.name


class Quality(Model):
	# Meta configurations
	class Meta:
		verbose_name = 'Qualidade'

	name = models.CharField(max_length=20, null=False, blank=False, unique=True)

	def __str__(self) -> str:
		return self.name


class Anime(Model):
	# Meta configurations
	class Meta:
		verbose_name = 'Anime'

	genres = models.ManyToManyField(Genre)

	name = models.CharField(max_length=200, null=False, blank=False, unique=True)
	image = models.ImageField(storage=anime_storage, null=False, blank=False, default='default.jpg')
	description = models.CharField(max_length=1500, null=False, blank=False)

	def __str__(self) -> str:
		return self.name


class Episode(Model):
	# Meta configurations
	class Meta:
		unique_together = ['anime', 'number']
		verbose_name = 'Episódio'

	anime = models.ForeignKey(Anime, on_delete=models.CASCADE)

	image = models.ImageField(storage=episode_storage, null=False, blank=False, default='default.jpg')
	number = models.IntegerField(default=0, null=False, blank=False)

	def __str__(self) -> str:
		return f"{self.anime} - {self.number}"


class Video(Model):
	episode = models.ForeignKey(Episode, on_delete=models.CASCADE)
	quality = models.ForeignKey(Quality, on_delete=models.CASCADE)

	url = models.URLField(null=False, blank=False, unique=True)

	def __str__(self) -> str:
		return f"{self.episode} [{self.quality}]"


class CustomUser(AbstractUser):
	# User custom fields
	avatar = models.ImageField(storage=user_storage, null=False, blank=False, default='default.jpg')
