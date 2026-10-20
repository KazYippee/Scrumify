from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path("login/", obtain_auth_token),
    path("chores/", views.chore_list),
    path("chores/<int:chore_id>/", views.chore_detail),
]
