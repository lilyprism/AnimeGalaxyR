import uuid


def unique_filename(instance, filename):
	return f"{uuid.uuid4()}.jpg"
