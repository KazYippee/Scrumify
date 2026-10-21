from django.urls import path
from . import views

urlpatterns = [
    path("chores/", views.chore_list, name="chore-create"),
    # Keep both route names for the shared GET/POST endpoint.
    path("chores/", views.chore_list, name="chore-list"),
    path("chores/<int:chore_id>/", views.chore_detail, name="chore-detail"),
    # Keep this name for compatibility with earlier tests and clients.
    path("chores/<int:chore_id>/", views.chore_detail, name="chore-delete"),
]
