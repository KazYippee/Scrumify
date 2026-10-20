from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Chore
from .serializers import ChoreSerializer


@api_view(["GET"])
def chore_list(request):
    chores = Chore.objects.all().order_by("id")
    serializer = ChoreSerializer(chores, many=True)
    return Response(serializer.data)


@api_view(["GET", "PUT"])
def chore_detail(request, chore_id):
    try:
        chore = Chore.objects.get(id=chore_id)
    except Chore.DoesNotExist:
        return Response({"error": "Chore not found"}, status=404)

    if request.method == "GET":
        serializer = ChoreSerializer(chore)
        return Response(serializer.data)

    # PUT: update the existing chore with the new values
    serializer = ChoreSerializer(chore, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)
