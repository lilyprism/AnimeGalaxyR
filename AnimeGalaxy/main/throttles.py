from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class LowUserRateThrottle(UserRateThrottle):
	rate = '4/hour'
	scope = "report"


class LowAnonRateThrottle(AnonRateThrottle):
	rate = '6/hour'
	scope = "report"


class NormalUserRateThrottle(UserRateThrottle):
	rate = '10/min'
	scope = "like"
