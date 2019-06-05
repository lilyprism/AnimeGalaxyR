"""
Django settings for AnimeGalaxy project.

Generated by 'django-admin startproject' using Django 2.2.1.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'i1q=0s0hx)f*aysw)z8clqul%8-^+cp%vtn6vb1r0itlx2d_sg'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
	'172.16.0.62',
	'localhost'
]

# Application definition

INSTALLED_APPS = [
	'main.apps.MainConfig',

	# Security Apps
	'corsheaders',

	# CKEditor Support
	'ckeditor',

	# Rest Framework Apps
	'rest_framework',
	'rest_framework.authtoken',
	'rest_auth',
	'allauth',
	'allauth.account',
	'allauth.socialaccount',
	'rest_auth.registration',
	'django_filters',

	# Django Apps
	'django.contrib.admin',
	'django.contrib.sites',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
]

MIDDLEWARE = [
	# Security Middleware
	'corsheaders.middleware.CorsMiddleware',

	# Default Security Middleware
	'django.middleware.security.SecurityMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.common.CommonMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',

	# Cache Middleware
	# 'django.middleware.cache.UpdateCacheMiddleware',
	# 'django.middleware.common.CommonMiddleware',
	# 'django.middleware.cache.FetchFromCacheMiddleware',
]

ROOT_URLCONF = 'AnimeGalaxy.urls'

TEMPLATES = [
	{
		'BACKEND' : 'django.template.backends.django.DjangoTemplates',
		'DIRS'    : [],
		'APP_DIRS': True,
		'OPTIONS' : {
			'context_processors': [
				'django.template.context_processors.debug',
				'django.template.context_processors.request',
				'django.contrib.auth.context_processors.auth',
				'django.contrib.messages.context_processors.messages',
			],
		},
	},
]

WSGI_APPLICATION = 'AnimeGalaxy.wsgi.application'

# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.sqlite3',
		'NAME'  : os.path.join(BASE_DIR, 'db.sqlite3'),
	}
}

# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
	{
		'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
	},
]

# User Model
AUTH_USER_MODEL = 'main.CustomUser'

# Rest Framework settings
REST_FRAMEWORK = {
	'DEFAULT_AUTHENTICATION_CLASSES': (
		'rest_framework.authentication.TokenAuthentication',
	),
	'DEFAULT_RENDERER_CLASSES'      : (
		'rest_framework.renderers.JSONRenderer',
	),
	'DEFAULT_FILTER_BACKENDS'       : ('django_filters.rest_framework.DjangoFilterBackend',),
	'DEFAULT_THROTTLE_RATES'        : {
		'anon': '30/min',
		'user': '60/min'
	}
}

REST_AUTH_SERIALIZERS = {
	"USER_DETAILS_SERIALIZER": "main.serializers.UserSerializer",
}
REST_AUTH_REGISTER_SERIALIZERS = {
	"REGISTER_SERIALIZER": "main.serializers.CustomRegisterSerializer",
}

SITE_ID = 1

CACHES = {
	'default': {
		'BACKEND' : 'django.core.cache.backends.memcached.MemcachedCache',
		'LOCATION': '127.0.0.1:11211',
		'TIMEOUT' : 30
	}
}

# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'pt-pt'

TIME_ZONE = 'Europe/Lisbon'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# CORS Policy
# https://github.com/ottoyiu/django-cors-headers
CORS_ORIGIN_ALLOW_ALL = True

# CKEditor Settings
# https://github.com/django-ckeditor/django-ckeditor
CKEDITOR_ALLOW_NONIMAGE_FILES = False
CKEDITOR_CONFIGS = {
	'default': {
		'tabSpaces': 4,
	}
}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
