import os

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.files.storage import FileSystemStorage
from django.db import models
from django.db.models import Model

# File Storage
user_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'users'), base_url=os.path.join(settings.MEDIA_URL, 'users'))


class Report(Model):
	# Model Fields
	classifier = models.CharField(max_length=20, null=False, blank=False, verbose_name="Classificador")
	info = models.CharField(max_length=250, null=False, blank=False, verbose_name="Informação")

	def __str__(self):
		return f"{self.pk} - {self.classifier} [{self.info}]"


class CustomUser(AbstractUser):
	# User custom fields
	avatar = models.ImageField(storage=user_storage, null=False, blank=False, default='default.jpg', verbose_name="Avatar")
