from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Chore
from .serializers import ChoreSerializer


@api_view(["GET"])
def chore_list(request):
    # Only get the chores that belong to the signed-in user
    chores = Chore.objects.filter(owner=request.user).order_by("id")
    serializer = ChoreSerializer(chores, many=True)
    return Response(serializer.data)


@api_view(["GET", "PUT"])
def chore_detail(request, chore_id):
    # Look for the chore among the signed-in user's chores only, so another
    # account's chore is treated the same as a chore that doesn't exist
    try:
        chore = Chore.objects.get(id=chore_id, owner=request.user)
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
