from AnimeGalaxy.celery import app
from Utils.ImageUtils import get_gif_from_url, get_thumbnail_from_video, resize_in_memory_uploaded_image
from episode.models import Episode


@app.task(name="process_gif")
def process_gif(instance: Episode, name: str):
	print("Processing GIF")

	# Create Gif
	tries = 0
	while tries < 10:
		try:
			video = get_gif_from_url(instance.sources[0].get("file"))
			instance.gif.file = resize_in_memory_uploaded_image(video, size=(255, 360))
			instance.gif.save(name, instance.gif.file, save=False)
			print("Gif Created", instance.gif.file.__str__())
			break
		except Exception as e:
			tries += 1
			print(e)


@app.task(name="process_gif_thumb")
def process_gif_thumb(instance: Episode, name: str):
	print("Processing GIF Thumb")

	# Create Gif Thumbnail
	tries = 0
	while tries < 10:
		try:
			image = get_thumbnail_from_video(instance.sources[0].get("file"))
			instance.image.file = resize_in_memory_uploaded_image(image, size=(255, 360))
			instance.image.save(name, instance.image.file, save=False)
			print("Gif Thumb Created")
			break
		except Exception as e:
			tries += 1
			print(e)
