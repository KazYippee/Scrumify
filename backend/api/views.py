from django.shortcuts import render
from rest_framework import generics
from .models import Chore
from .serializers import ChoreSerializer

# Create your views here.

class createChoreView(generics.CreateAPIView):
    queryset = Chore.objects.all()
    serializer_class = ChoreSerializer



