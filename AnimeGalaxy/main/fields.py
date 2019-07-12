from django.db.models import CharField


class NonStrippingCharField(CharField):
	"""A CharField that does not strip whitespace at the beginning/end of
	it's value.  Might be important for markup/code."""

	def formfield(self, **kwargs):
		kwargs['strip'] = False
		return super(NonStrippingCharField, self).formfield(**kwargs)
