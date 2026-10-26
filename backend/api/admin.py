from django.contrib import admin
from .models import Chore

@admin.register(Chore)
class ChoreAdmin(admin.ModelAdmin):
    list_display = ("description", "due_date", "due_time", "status", "points", "owner")
    fields = ("description", "due_date", "due_time", "status", "points", "owner")
