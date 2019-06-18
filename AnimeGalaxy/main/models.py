import os

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.files.storage import FileSystemStorage
from django.db import models

# File Storage
user_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'users'), base_url=os.path.join(settings.MEDIA_URL, 'users'))


class CustomUser(AbstractUser):
	# User custom fields
	avatar = models.ImageField(storage=user_storage, null=False, blank=False, default='default.jpg', verbose_name="Avatar")
	description = models.CharField(max_length=250, null=False, blank=True, default="")
