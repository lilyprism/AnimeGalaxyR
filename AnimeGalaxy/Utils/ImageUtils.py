import os
import sys
from io import BytesIO
from typing import Tuple

from PIL import Image, ImageOps
from PIL.Image import ANTIALIAS
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models.fields.files import ImageFieldFile


def resize_image(image: InMemoryUploadedFile, size: Tuple[int, int] = (100, 100)) -> BytesIO:
	im = Image.open(image)

	output = BytesIO()
	im = ImageOps.fit(im, size, ANTIALIAS)
	im.save(output, format='JPEG', optimize=True, quality=85)
	output.seek(0)

	return output


def resize_in_memory_uploaded_image(image: InMemoryUploadedFile, size: Tuple[int, int]) -> InMemoryUploadedFile:
	image_bytes = resize_image(image, size)
	return InMemoryUploadedFile(
			image_bytes,
			'ImageField',
			f'{image.name.split(".")[0]}.jpg',
			'image/jpeg',
			sys.getsizeof(image_bytes),
			None)


def delete_images_on_model_delete(instance):
	for attr, value in instance.__dict__.items():
		if not isinstance(getattr(instance, attr), ImageFieldFile):
			continue

		image = getattr(instance, attr)
		if image and image != "default.jpg" and os.path.isfile(image.path):
			os.remove(image.path)


def delete_images_on_model_change(sender, instance):
	# Prevent deletion on creation
	if not instance.pk:
		return False

	# Try to get the sender object
	try:
		sender_obj = sender.objects.get(pk=instance.pk)
	except sender.DoesNotExist:
		return False

	for attr, value in sender_obj.__dict__.items():
		if not isinstance(getattr(sender_obj, attr), ImageFieldFile):
			continue

		old_file = getattr(sender_obj, attr)
		if old_file != "default.jpg" and not getattr(instance, attr) == old_file and old_file and os.path.isfile(old_file.path):
			os.remove(old_file.path)
