from django.db import models
from django.db.models import Model
from django.utils.translation import ugettext_lazy as _


class Report(Model):
	# Model Fields
	classifier = models.CharField(max_length=20, null=False, blank=False, verbose_name=_("Classifier"))
	info = models.CharField(max_length=250, null=False, blank=False, verbose_name=_("Information"))

	def __str__(self):
		return f"{self.pk} - {self.classifier} [{self.info}]"
