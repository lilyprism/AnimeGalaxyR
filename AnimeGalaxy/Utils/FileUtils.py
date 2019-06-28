def unique_filename(instance, filename):
	return f"{instance.pk}-{filename[:2]}.jpg"
