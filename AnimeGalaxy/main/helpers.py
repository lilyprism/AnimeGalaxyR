import json
import re
from typing import List

import requests


def get_quality_from_format(number: int) -> str:
	if number == 18:
		return "SD"
	elif number == 22:
		return "HD"
	else:
		return "Auto"


def get_sources_from_url(url: str) -> List:
	""" Returns a list of sources """

	# URLs from BRAnimes have redirect urls, so just send them back
	if "branimes" in url:
		return [{"file": get_redirect_url(url), "type": "video/mp4", "label": "SD"}]

	# Everything other than blogger URLs, return them as HD
	if "blogger.com" not in url:
		return [{"file": url, "type": "video/mp4", "label": "HD"}]

	# Parse video configs from blogger url
	try:
		CONFIG_REGEX = r"VIDEO_CONFIG = .+\}"
		response = requests.get(url)
		match = re.findall(CONFIG_REGEX, response.text, re.DOTALL)[0]
		js = json.loads(match[15:])
	except:
		return [{"file": url, "type": "video/mp4", "label": "SD"}]

	# Add all qualities from parsed video configs to an array of sources
	sources = [
		{
			"file" : source.get("play_url", ""),
			"type" : "video/mp4",
			"label": get_quality_from_format(source.get("format_id", 0))
		}
		for source in js.get("streams", [])]

	return sources


def get_redirect_url(url: str) -> str:
	""" Returns the first redirect url from given url """
	session = requests.Session()
	session.max_redirects = 1
	try:
		r = session.post(url)
	except requests.exceptions.TooManyRedirects as exc:
		r = exc.response

	return r.url
