import os
from typing import List

from ckeditor.fields import RichTextField
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.cache import cache
from django.core.files.storage import FileSystemStorage
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import Model
from django.utils import timezone
from mptt.fields import TreeForeignKey
from mptt.models import MPTTModel

from .helpers import get_sources_from_url

# File Storage

anime_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'animes'), base_url=os.path.join(settings.MEDIA_URL, 'animes'))
thumb_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'thumbs'), base_url=os.path.join(settings.MEDIA_URL, 'thumbs'))
user_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'users'), base_url=os.path.join(settings.MEDIA_URL, 'users'))


class Genre(Model):
	# Meta configurations
	class Meta:
		verbose_name = 'Género'

	# Model fields
	name = models.CharField(max_length=50, null=False, blank=False, unique=True, verbose_name="Nome")

	def __str__(self) -> str:
		return self.name


class Anime(Model):
	# Meta configurations
	class Meta:
		verbose_name = 'Anime'

	# Model relations
	genres = models.ManyToManyField(Genre, verbose_name="Géneros", related_name="animes", blank=False)

	# Model fields
	name = models.CharField(max_length=200, null=False, blank=False, unique=True, verbose_name="Nome")
	image = models.ImageField(storage=anime_storage, null=False, blank=False, default='default.jpg', verbose_name="Imagem")
	thumbnail = models.ImageField(storage=thumb_storage, null=False, blank=False, default='default.jpg', verbose_name="Thumbnail")
	description = RichTextField(null=False, blank=False, verbose_name="Descrição")

	@property
	def genre_list(self) -> str:
		""" Returns genres as string to index on search engine """
		return " ".join([genre.name for genre in self.genres.all()])

	def __str__(self) -> str:
		return self.name


class Episode(Model):
	# Meta configurations
	class Meta:
		unique_together = ['anime', 'number']
		verbose_name = 'Episódio'

	# Model relations
	anime = models.ForeignKey(Anime, on_delete=models.CASCADE, verbose_name="Anime", related_name="episodes", null=False, blank=False)

	# Model fields
	number = models.IntegerField(default=0, null=False, blank=False, validators=[MinValueValidator(0)], verbose_name="Número de Episódio")
	views = models.IntegerField(default=0, null=False, validators=[MinValueValidator(0)], verbose_name="Visualizações")
	blogger_url = models.URLField(max_length=1500, null=False, blank=False, verbose_name="URL de Blogger")

	# Hidden Model fields
	added = models.DateTimeField(default=timezone.now, editable=False)

	def __str__(self) -> str:
		return f"{self.anime} - {self.number}"

	@property
	def sources(self) -> List:
		""" Gets and caches sources for 6 hours """
		sources = cache.get(f"episode{self.pk}")
		if not sources:
			sources = get_sources_from_url(self.blogger_url)
			cache.set(f"episode{self.pk}", sources, timeout=60 * 60 * 6)
		return sources


class CustomUser(AbstractUser):
	# User custom fields
	avatar = models.ImageField(storage=user_storage, null=False, blank=False, default='default.jpg', verbose_name="Avatar")
	episodes = models.ManyToManyField(Episode, through='UserEpisodes', related_name='users', verbose_name='Episódios')


class UserEpisodes(Model):
	# Meta configurations
	class Meta:
		verbose_name = "Episódio de Utilizador"
		verbose_name_plural = "Episódios de Utilizador"
		unique_together = ['episode', 'user']

	# Model relations
	episode = models.ForeignKey(Episode, related_name='user_episodes', on_delete=models.CASCADE)
	user = models.ForeignKey(CustomUser, related_name='user_episodes', on_delete=models.CASCADE)

	# Model Fields
	liked = models.BooleanField(default=None, null=True, blank=True, verbose_name='Video Gostado')
	date = models.DateTimeField(auto_now=True, null=False, editable=False)

	def __str__(self):
		return self.episode.__str__()


class Report(Model):
	# Model Fields
	classifier = models.CharField(max_length=20, null=False, blank=False, verbose_name="Classificador")
	info = models.CharField(max_length=250, null=False, blank=False, verbose_name="Informação")

	def __str__(self):
		return f"{self.pk} - {self.classifier} [{self.info}]"


class Comment(MPTTModel):
	# Model Relations
	episode = models.ForeignKey(Episode, related_name="comments", on_delete=models.CASCADE)

	# Model Fields
	date = models.DateTimeField(auto_now=True, null=False, blank=True)
	user = models.ForeignKey(CustomUser, related_name="comments", on_delete=models.CASCADE)
	text = models.CharField(max_length=2500, null=False, blank=False, verbose_name="Conteudo")

	# Relation to self (recursive)
	parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name="children")

	def __str__(self):
		return f"[{self.episode.__str__()}]: {self.text[:25]}"
