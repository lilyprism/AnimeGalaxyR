from django.db import models
from django.db.models import Model


class Report(Model):
	# Model Fields
	classifier = models.CharField(max_length=20, null=False, blank=False, verbose_name="Classificador")
	info = models.CharField(max_length=250, null=False, blank=False, verbose_name="Informação")

	def __str__(self):
		return f"{self.pk} - {self.classifier} [{self.info}]"
