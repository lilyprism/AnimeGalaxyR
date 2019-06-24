from haystack import indexes

from .models import Anime


class AnimeIndex(indexes.SearchIndex, indexes.Indexable):
	text = indexes.CharField(document=True)
	name = indexes.NgramField(model_attr='name')

	def get_model(self):
		return Anime

	def index_queryset(self, using=None):
		"""Used when the entire index for model is updated."""
		return self.get_model().objects.all()
