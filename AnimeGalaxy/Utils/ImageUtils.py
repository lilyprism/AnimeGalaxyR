import os
import sys
from io import BytesIO
from typing import Tuple

import ffmpeg
from PIL import Image, ImageOps
from PIL.Image import ANTIALIAS
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models.fields.files import ImageFieldFile


def resize_image(image: InMemoryUploadedFile, size: Tuple[int, int] = (100, 100)) -> BytesIO:
	im = Image.open(image)

	output = BytesIO()

	if im.format == "GIF":
		im.save(output, format='webp', optimize=True, quality=60, save_all=True, minimize_size=True, duration=100, lossless=False, method=2)
	else:
		im = ImageOps.fit(im, size, ANTIALIAS)
		im.save(output, format='webp', optimize=True, quality=85, save_all=True, minimize_size=True)
	output.seek(0)

	return output


def resize_in_memory_uploaded_image(image: InMemoryUploadedFile, size: Tuple[int, int]) -> InMemoryUploadedFile:
	image_bytes = resize_image(image, size)
	return InMemoryUploadedFile(
			image_bytes,
			'ImageField',
			f'{image.name.split(".")[0]}.webp',
			f'image/webp',
			sys.getsizeof(image_bytes),
			None)


def get_gif_from_url(url) -> InMemoryUploadedFile:
	out, _ = (
		ffmpeg
			.input(url, ss='00:13:50', t=10)
			.filter("crop", 153, 216)
			.filter("fps", 5)
			.output('pipe:', format='gif')
			.global_args('-loglevel', 'error')
			.global_args('-y')
			.global_args('-r', '1')
			.run(capture_stdout=True)
	)

	f = BytesIO()
	f.write(out)
	f.seek(0)

	return InMemoryUploadedFile(
			f,
			'ImageField',
			f'temp.gif',
			'image/gif',
			sys.getsizeof(f),
			None
	)


def get_thumbnail_from_video(url) -> InMemoryUploadedFile:
	out, _ = (
		ffmpeg
			.input(url, ss='00:13:50')
			.filter("crop", 153, 216)
			.output('pipe:', vframes=1, format='webp')
			.global_args('-loglevel', 'error')
			.global_args('-y')
			.run(capture_stdout=True)
	)

	f = BytesIO()
	f.write(out)
	f.seek(0)

	return InMemoryUploadedFile(
			f,
			'ImageField',
			f'temp.webp',
			'image/webp',
			sys.getsizeof(f),
			None
	)


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
