from rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers

from .models import CustomUser, Report


class CustomRegisterSerializer(RegisterSerializer):
	email = serializers.EmailField(required=True)
	username = serializers.CharField(required=True)
	password1 = serializers.CharField(write_only=True, required=True)
	password2 = serializers.CharField(write_only=True, required=True)


class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ['id', 'username', 'first_name', 'last_name', 'email', 'avatar']
		read_only_fields = ['id', 'username']

	def get_avatar(self, instance):
		request = self.context.get('request')
		image_url = instance.avatar.url
		return request.build_absolute_uri(image_url)


class SimpleUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ['id', 'username', 'avatar']

	def get_avatar(self, instance):
		request = self.context.get('request')
		image_url = instance.avatar.url
		return request.build_absolute_uri(image_url)


class ReportSerializer(serializers.ModelSerializer):
	class Meta:
		model = Report
		fields = '__all__'
