from django.urls import path
from .views import chore_delete, createChoreView

urlpatterns = [
    path("chores/", createChoreView.as_view(), name="chore-create"),
    # Keep both route names for the shared GET/POST endpoint.
    path("chores/", createChoreView.as_view(), name="chore-list"),
    path("chores/<int:pk>/", chore_delete, name="chore-delete"),
]
