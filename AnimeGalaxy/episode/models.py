from typing import List

from django.core.cache import cache
from django.db import models
from django.db.models import Model
from django.utils import timezone
from rest_framework.compat import MinValueValidator

from anime.models import Season
from main.helpers import get_sources_from_url
from main.models import CustomUser


class Episode(Model):
	# Meta configurations
	class Meta:
		unique_together = ['season', 'number']
		verbose_name = 'Episódio'

	# Model relations
	season = models.ForeignKey(Season, on_delete=models.CASCADE, verbose_name="Temporada", related_name="episodes", null=False, blank=False)
	users = models.ManyToManyField(CustomUser, through='UserEpisodes', related_name='users', verbose_name='Episódios')

	# Model fields
	number = models.FloatField(default=1, null=False, blank=False, validators=[MinValueValidator(0)], verbose_name="Número de Episódio")
	views = models.IntegerField(default=0, null=False, validators=[MinValueValidator(0)], verbose_name="Visualizações")
	blogger_url = models.URLField(max_length=1500, null=False, blank=False, verbose_name="URL")

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
		sources = cache.get(f"episode{self.pk}")
		if not sources:
			sources = get_sources_from_url(self.blogger_url)
			cache.set(f"episode{self.pk}", sources, timeout=60 * 60 * 6)
		return sources


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
