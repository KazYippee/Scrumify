from rest_framework import generics
from rest_framework.response import Response
from .models import Chore
from .serializers import ChoreSerializer

class createChoreView(generics.CreateAPIView):
    queryset = Chore.objects.all()
    serializer_class = ChoreSerializer

    def get(self, request, *args, **kwargs):
        # Read saved chores from the database whenever the app opens or refreshes.
        chores = self.get_queryset().order_by("id")
        return Response({"chores": self.get_serializer(chores, many=True).data})
