import os

from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from Utils.ImageUtils import delete_images_on_model_change, delete_images_on_model_delete, get_gif_from_url, get_thumbnail_from_video, resize_in_memory_uploaded_image
from episode.models import Episode


@receiver(post_delete, sender=Episode)
def after_anime_delete(sender, instance, **kwargs):
	delete_images_on_model_delete(instance)


@receiver(pre_save, sender=Episode)
def before_anime_save(sender, instance: Episode, **kwargs):
	delete_images_on_model_change(sender, instance)

	if "default" in instance.gif.__str__() or not os.path.isfile(instance.gif.path):
		# Create Gif
		try:
			video = get_gif_from_url(instance.sources[0].get("file"))
			instance.gif.file = resize_in_memory_uploaded_image(video, size=(255, 360))
			instance.gif.save(instance.gif.file.__str__(), instance.gif.file, save=False)
		except:
			pass

	if "default" in instance.image.__str__() or not os.path.isfile(instance.image.path):
		# Create Gif Thumbnail
		try:
			image = get_thumbnail_from_video(instance.sources[0].get("file"))
			instance.image.file = resize_in_memory_uploaded_image(image, size=(255, 360))
			instance.image.save(instance.image.file.__str__(), instance.image.file, save=False)
		except:
			pass
