import os
from typing import List

from django.conf import settings
from django.core.cache import cache
from django.core.files.storage import FileSystemStorage
from django.db import models
from django.db.models import Model
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from rest_framework.compat import MinValueValidator

from Utils.FileUtils import unique_filename
from anime.models import Season
from main.helpers import get_sources_from_url
from main.models import CustomUser

gif_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'episodes', 'gifs'), base_url=os.path.join(settings.MEDIA_URL, 'episodes', 'gifs'))
gif_thumb_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'episodes', 'thumbs'), base_url=os.path.join(settings.MEDIA_URL, 'episodes', 'thumbs'))


class Episode(Model):
	# Meta configurations
	class Meta:
		unique_together = ['season', 'number']
		verbose_name = _('Episode')

	# Model relations
	season = models.ForeignKey(Season, on_delete=models.CASCADE, verbose_name=_("Season"), related_name="episodes", null=False, blank=False)
	users = models.ManyToManyField(CustomUser, through='UserEpisodes', related_name='users', verbose_name=_('Episodes'))

	# Model fields
	number = models.FloatField(default=1, null=False, blank=False, validators=[MinValueValidator(0)], verbose_name=_("Episode Number"))
	views = models.IntegerField(default=0, null=False, validators=[MinValueValidator(0)], verbose_name=_("Views"))
	blogger_url = models.URLField(max_length=1500, null=False, blank=False, verbose_name=_("URL"))
	gif = models.ImageField(storage=gif_storage, null=False, blank=False, default='default.jpg', verbose_name=_("Gif"), upload_to=unique_filename)
	image = models.ImageField(storage=gif_thumb_storage, null=False, blank=False, default='default.jpg', verbose_name=_("Thumbnail"), upload_to=unique_filename)

	# Hidden Model fields
	added = models.DateTimeField(default=timezone.now, editable=False)

	@property
	def str_number(self) -> str:
		return self.number.__str__()[:-2] if self.number.__str__().endswith(".0") else self.number.__str__()

	def __str__(self) -> str:
		return f"{self.season} E{self.str_number}"

	@property
	def sources(self) -> List:
		""" Gets and caches sources for 6 hours """
		sources = cache.get(f"episode{self.number}{self.season.id}")
		if not sources:
			sources = get_sources_from_url(self.blogger_url)
			cache.set(f"episode{self.number}{self.season.id}", sources, timeout=60 * 60 * 6)
		return sources


class UserEpisodes(Model):
	# Meta configurations
	class Meta:
		verbose_name = _("User Episode")
		verbose_name_plural = _("User Episodes")
		unique_together = ['episode', 'user']

	# Model relations
	episode = models.ForeignKey(Episode, related_name='user_episodes', on_delete=models.CASCADE)
	user = models.ForeignKey(CustomUser, related_name='user_episodes', on_delete=models.CASCADE)

	# Model Fields
	liked = models.BooleanField(default=None, null=True, blank=True, verbose_name=_('Video Liked'))
	favorite = models.BooleanField(default=False, null=False, blank=False, verbose_name=_("Video Favorite"))
	watch_later = models.BooleanField(default=False, null=False, blank=False, verbose_name=_("View Later"))
	watched = models.BooleanField(default=False, null=False, blank=False, verbose_name=("Viewed"))
	date = models.DateTimeField(auto_now=True, null=False, editable=False)

	def __str__(self):
		return self.episode.__str__()


# noinspection PyUnresolvedReferences
from . import signals
