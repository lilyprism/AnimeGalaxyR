import json
import re
from typing import List

import requests


def get_quality_from_format(format: int) -> str:
	if format == 18:
		return "SD"
	elif format == 22:
		return "HD"
	else:
		return "Auto"


def get_sources_from_url(url: str) -> List:
	if "branimes" in url:
		return [{"file": get_redirect_url(url), "type": "video/mp4", "label": "SD"}]
	if "blogger.com" not in url:
		return [{"file": url, "type": "video/mp4", "label": "HD"}]

	CONFIG_REGEX = r"VIDEO_CONFIG = .+\}"
	response = requests.get(url)
	try:
		match = re.findall(CONFIG_REGEX, response.text, re.DOTALL)[0]
	except:
		return [{"file": url, "type": "video/mp4", "label": "SD"}]

	js = json.loads(match[15:])

	sources = []
	for source in js.get("streams", []):
		sources.append({"file": source.get("play_url", ""), "type": "video/mp4", "label": get_quality_from_format(source.get("format_id", 0))})

	return sources


def get_redirect_url(url: str) -> str:
	session = requests.Session()
	session.max_redirects = 1
	try:
		r = session.post(url)
	except requests.exceptions.TooManyRedirects as exc:
		r = exc.response

	return r.url
