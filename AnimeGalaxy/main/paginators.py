from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
	page_size = 24
	template = None


class HomeResultsSetPagination(PageNumberPagination):
	page_size = 8
	template = None


class AnimeListResultsSetPagination(PageNumberPagination):
	page_size = 24
	template = None


class EpisodeResultsSetPagination(PageNumberPagination):
	page_size = 12
	template = None
