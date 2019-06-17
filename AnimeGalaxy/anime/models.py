import os

from ckeditor.fields import RichTextField
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.db import models
from django.db.models import Model

# File Storage
anime_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'animes'), base_url=os.path.join(settings.MEDIA_URL, 'animes'))
thumb_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'thumbs'), base_url=os.path.join(settings.MEDIA_URL, 'thumbs'))


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
	complete = models.BooleanField(verbose_name="Completo", default=False, null=False, blank=False)

	@property
	def genre_list(self) -> str:
		""" Returns genres as string to index on search engine """
		return " ".join([genre.name for genre in self.genres.all()])

	def __str__(self) -> str:
		return self.name
