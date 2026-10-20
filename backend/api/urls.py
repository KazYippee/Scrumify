from django.urls import path
from . import views

urlpatterns = [
    path("chores/", views.chore_list),
    path("chores/<int:chore_id>/", views.chore_detail),
]
