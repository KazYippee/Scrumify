from rest_framework import serializers
from .models import Chore


class ChoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chore
        fields = ["id", "description", "due_date", "status", "points"]
        read_only_fields = ["id"]
