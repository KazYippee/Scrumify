from django.urls import path
from .views import choreDetailView, createChoreView

urlpatterns = [
    path("chores/", createChoreView.as_view(), name="chore-create"),
    path("chores/<int:pk>/", choreDetailView.as_view(), name="chore-detail"),
]
