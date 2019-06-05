from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class ReportUserRateThrottle(UserRateThrottle):
	rate = '4/hour'
	scope = "report"


class ReportAnonRateThrottle(AnonRateThrottle):
	rate = '6/hour'
	scope = "report"


class LikeUserRateThrottle(UserRateThrottle):
	rate = '10/min'
	scope = "like"
