from rest_framework import generics
from .models import Chore
from .serializers import ChoreSerializer


class createChoreView(generics.ListCreateAPIView):
    queryset = Chore.objects.all().order_by("due_date", "id")
    serializer_class = ChoreSerializer


class choreDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Chore.objects.all()
    serializer_class = ChoreSerializer



