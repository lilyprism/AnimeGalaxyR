from django.conf import settings
from django.db import models
from django.db.models import Model
from django.utils.translation import ugettext_lazy as _
from mptt.fields import TreeForeignKey
from mptt.models import MPTTModel

from episode.models import Episode
from main.models import CustomUser


class Comment(MPTTModel):
	# Meta configuration
	class Meta:
		verbose_name = _("Comment")

	# Model Relations
	episode = models.ForeignKey(Episode, related_name="comments", on_delete=models.CASCADE)
	users = models.ManyToManyField(CustomUser, through='UserCommentRatings', related_name='comment_ratings', verbose_name=_('Comments'))

	# Model Fields
	date = models.DateTimeField(auto_now=True, null=False, blank=True)
	user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="comments", on_delete=models.CASCADE)
	text = models.CharField(max_length=2500, null=False, blank=False, verbose_name=_("Content"))

	# Relation to self (recursive)
	parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name="children")

	def __str__(self):
		return f"[{self.episode.__str__()}]: {self.text[:25]}"


class UserCommentRatings(Model):
	# Meta configuration
	class Meta:
		verbose_name = _("User Comment")
		verbose_name_plural = _("User Comments")

	# Model relations
	comment = models.ForeignKey(Comment, related_name="user_comment_rating", on_delete=models.CASCADE)
	user = models.ForeignKey(CustomUser, related_name="user_comment_rating", on_delete=models.CASCADE)

	# Model Fields
	liked = models.BooleanField(default=None, null=True, verbose_name=_('Comentário Gostado'))
	date = models.DateTimeField(auto_now=True, null=False, editable=False)

	def __str__(self):
		return self.comment.__str__()
