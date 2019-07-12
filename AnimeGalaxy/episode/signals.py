import os
import uuid

from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from Utils.ImageUtils import delete_images_on_model_change, delete_images_on_model_delete
from episode.models import Episode
from .tasks import process_gif, process_gif_thumb


@receiver(post_delete, sender=Episode)
def after_anime_delete(sender, instance, **kwargs):
	delete_images_on_model_delete(instance)


@receiver(pre_save, sender=Episode)
def before_anime_save(sender, instance: Episode, **kwargs):
	delete_images_on_model_change(sender, instance)

	if "default" in instance.gif.__str__() or not os.path.isfile(instance.gif.path):
		name = f"{uuid.uuid4()}.webp"
		instance.gif.name = name
		process_gif.delay(instance, name)

	if "default" in instance.image.__str__() or not os.path.isfile(instance.image.path):
		name = f"{uuid.uuid4()}.webp"
		instance.image.name = name
		process_gif_thumb.delay(instance, name)
