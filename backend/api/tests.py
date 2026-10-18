import datetime

from django.test import TestCase
from .models import Chore


class ChoreTests(TestCase):
    def test_save_and_get_chore(self):
        chore = Chore(
            description="Take out the trash",
            due_date=datetime.date(2026, 10, 20),
            status="todo",
            points=3,
        )
        chore.save()

        saved = Chore.objects.get(id=chore.id)
        self.assertEqual(saved.description, "Take out the trash")
        self.assertEqual(saved.due_date, datetime.date(2026, 10, 20))
        self.assertEqual(saved.status, "todo")
        self.assertEqual(saved.points, 3)

    def test_default_status_and_points(self):
        chore = Chore.objects.create(
            description="Wash dishes",
            due_date=datetime.date(2026, 10, 21),
        )
        saved = Chore.objects.get(id=chore.id)
        self.assertEqual(saved.status, "todo")
        self.assertEqual(saved.points, 0)

    def test_update_status(self):
        chore = Chore.objects.create(
            description="Vacuum",
            due_date=datetime.date(2026, 10, 22),
            points=5,
        )
        chore.status = "done"
        chore.save()

        saved = Chore.objects.get(id=chore.id)
        self.assertEqual(saved.status, "done")

    def test_string_is_description(self):
        chore = Chore.objects.create(
            description="Do laundry",
            due_date=datetime.date(2026, 10, 23),
        )
        self.assertEqual(str(chore), "Do laundry")
