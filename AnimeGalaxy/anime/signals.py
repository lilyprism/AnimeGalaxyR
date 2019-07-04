import os

from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from Utils.ImageUtils import delete_images_on_model_change, delete_images_on_model_delete, resize_in_memory_uploaded_image
from anime.models import Anime


@receiver(post_delete, sender=Anime)
def after_anime_delete(sender, instance, **kwargs):
	delete_images_on_model_delete(instance)


@receiver(pre_save, sender=Anime)
def before_anime_save(sender, instance, **kwargs):
	delete_images_on_model_change(sender, instance)

	if instance.image and not os.path.isfile(instance.image.path):
		instance.image.file = resize_in_memory_uploaded_image(instance.image, size=(255, 360))

	if instance.thumbnail and not os.path.isfile(instance.thumbnail.path):
		instance.thumbnail.file = resize_in_memory_uploaded_image(instance.thumbnail, size=(1920, 1080))
