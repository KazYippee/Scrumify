from django.urls import path
from .views import createChoreView

urlpatterns = [
    path("chores/", createChoreView.as_view(), name="chore-create"),
]
