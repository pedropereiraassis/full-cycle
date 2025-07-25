"""
URL configuration for django_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path

from rest_framework.routers import DefaultRouter

from src.django_project.cast_member_app.views import CastMemberViewSet
from src.django_project.category_app.views import CategoryViewSet
from src.django_project.genre_app.views import GenreViewSet
from src.django_project.video_app.views import VideoViewSet

router = DefaultRouter()
router.register(prefix=r"api/categories", viewset=CategoryViewSet, basename="category")
router.register(prefix=r"api/genres", viewset=GenreViewSet, basename="genre")
router.register(
    prefix=r"api/cast_members", viewset=CastMemberViewSet, basename="cast_member"
)
router.register(prefix=r"api/videos", viewset=VideoViewSet, basename="video")

urlpatterns = [
    path("admin/", admin.site.urls),
] + router.urls
