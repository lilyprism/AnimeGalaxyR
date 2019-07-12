import os

from ckeditor.fields import RichTextField
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Model
from django.utils.translation import ugettext_lazy as _

from Utils.FileUtils import unique_filename
# File Storage
from main.fields import NonStrippingCharField
from main.models import CustomUser

anime_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'animes'), base_url=os.path.join(settings.MEDIA_URL, 'animes'))
thumb_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'thumbs'), base_url=os.path.join(settings.MEDIA_URL, 'thumbs'))


class Genre(Model):
	# Meta configurations
	class Meta:
		verbose_name = _('Genre')

	# Model fields
	name = models.CharField(max_length=50, null=False, blank=False, unique=True, verbose_name=_("Name"))

	def __str__(self) -> str:
		return self.name


class Person(Model):
	class Meta:
		verbose_name = _("Person")

	# Model Fields
	name = models.CharField(max_length=150, null=False, blank=False, unique=True, verbose_name=_("Name"))

	def __str__(self):
		return self.name


class Studio(Model):
	class Meta:
		verbose_name = _("Studio")

	# Model Fields
	name = models.CharField(max_length=150, null=False, blank=False, unique=True, verbose_name=_("Name"))

	def __str__(self):
		return self.name


class Anime(Model):
	# Meta configurations
	class Meta:
		verbose_name = _('Anime')

	# Model relations
	genres = models.ManyToManyField(Genre, verbose_name=_("Genres"), related_name="animes", blank=False)
	author = models.ForeignKey(Person, verbose_name=_("Author"), related_name="anime_authors", blank=False, on_delete=models.CASCADE)
	director = models.ForeignKey(Person, verbose_name=_("Director"), related_name="anime_directors", blank=False, on_delete=models.CASCADE)
	studio = models.ForeignKey(Studio, verbose_name=_("Studio"), related_name="anime_studios", blank=False, on_delete=models.CASCADE)

	# Model fields
	name = models.CharField(max_length=200, null=False, blank=False, unique=True, verbose_name="Nome")
	image = models.ImageField(storage=anime_storage, null=False, blank=False, default='default.jpg', verbose_name=_("Image"), upload_to=unique_filename)
	thumbnail = models.ImageField(storage=thumb_storage, null=False, blank=False, default='default.jpg', verbose_name=_("Thumbnail"), upload_to=unique_filename)
	trailer = models.URLField(max_length=200, null=False, blank=False, verbose_name=_("Trailer"), default="https://www.youtube.com/embed/l_98K4_6UQ0")
	description = RichTextField(null=False, blank=False, verbose_name=_("Description"))

	def __str__(self) -> str:
		return f"{self.name}"


class UserAnimes(Model):
	# Meta Configuration
	class Meta:
		verbose_name = _("User Animes")
		unique_together = ['user', 'anime']

	def __str__(self):
		return f"{self.user} - {self.anime}"

	# Model Relations
	user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, verbose_name=_('User'), related_name='user_animes', null=False, blank=False)
	anime = models.ForeignKey(Anime, on_delete=models.CASCADE, verbose_name=_('Anime'), related_name='user_animes', null=False, blank=False)

	# Model Fields
	rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])


class Season(Model):
	# Meta configuration
	class Meta:
		verbose_name = _("Season")
		verbose_name_plural = _("Seasons")

	def __str__(self):
		return f"{self.anime}" if self.anime.seasons.count() <= 1 else f"{self.anime} {self.number}" if not self.name else f"{self.anime}{self.name}"

	# Model Relations
	anime = models.ForeignKey(Anime, on_delete=models.CASCADE, verbose_name=_("Anime"), related_name="seasons", null=False, blank=False)

	# Model Fields
	number = models.IntegerField(default=1, null=False, validators=[MinValueValidator(0)], verbose_name=_("Season Number"))
	name = NonStrippingCharField(max_length=150, default=None, null=True, blank=True, verbose_name=_("Name"))
	complete = models.BooleanField(default=True, null=False, verbose_name=_("Completed"))


# noinspection PyUnresolvedReferences
from . import signals
