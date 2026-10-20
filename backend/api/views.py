from django.http import HttpResponse, JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_http_methods, require_safe
from rest_framework import generics

from .models import Chore
from .serializers import ChoreSerializer


# Decorators restrict which HTTP methods a view accepts, this allows GET and HEAD.
@require_safe
def chore_list(request):
    # Returns a JSON response with the list of chores and a CSRF token for security.
    return JsonResponse({
        # Read only the fields the dropdown needs
        "chores": list(Chore.objects.order_by("id").values("id", "description")),
        "csrfToken": get_token(request),
    })


class createChoreView(generics.CreateAPIView):
    queryset = Chore.objects.all()
    serializer_class = ChoreSerializer

    def get(self, request, *args, **kwargs):
        return chore_list(request)


@require_http_methods(["DELETE"])
def chore_delete(request, pk):
    # pk is the database ID from the URL. Return 404 if it does not exist.
    get_object_or_404(Chore, pk=pk).delete()
    # 204 means success with no response body, the frontend can now update its list.
    return HttpResponse(status=204)
