import os

from ckeditor.fields import RichTextField
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.core.validators import MinValueValidator
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

	def __str__(self) -> str:
		return self.name


class Season(Model):
	# Meta configurations
	class Meta:
		pass

	def __str__(self):
		return f"{self.anime} - T{self.number}"

	# Model Relations
	anime = models.ForeignKey(Anime, on_delete=models.CASCADE, verbose_name="Anime", related_name="seasons", null=False, blank=False)

	# Model Fields
	number = models.IntegerField(default=1, null=False, validators=[MinValueValidator(0)], verbose_name="Número de Temporada")
	complete = models.BooleanField(default=True, null=False, verbose_name="Completo")
