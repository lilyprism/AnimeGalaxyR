from django.utils.translation import ugettext_lazy as _
from jet.dashboard import modules
from jet.dashboard.dashboard import Dashboard


class CustomIndexDashboard(Dashboard):
	columns = 2

	def init_with_context(self, context):
		# Set all available modules
		self.available_children.append(modules.LinkList)
		self.available_children.append(modules.AppList)
		self.available_children.append(modules.RecentActions)

		# Set all initial modules with configs
		self.children.append(modules.LinkList(
				_('Quick Links'),
				children=[
					{
						'title'   : _('Return to site'),
						'url'     : '/',
						'external': True,
					},
					{
						'title'   : _('Change password'),
						'url'     : 'password_change/',
						'external': False,
					},
					{
						'title'   : _('Log out'),
						'url'     : 'logout/',
						'external': False,
					},
				],
				collapsible=False,
				deletable=False,
				layout='inline',
				column=0,
				order=0
		))
		self.children.append(modules.AppList(
				_('Applications'),
				column=1,
				order=0
		))
		self.children.append(modules.RecentActions(
				_('Recent Actions'),
				10,
				column=0,
				order=1
		))
