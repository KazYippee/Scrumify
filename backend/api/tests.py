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


class ChoreApiTests(TestCase):
    def setUp(self):
        self.chore = Chore.objects.create(
            description="Mow the lawn",
            due_date=datetime.date(2026, 10, 24),
            status="todo",
            points=2,
        )

    def test_list_chores(self):
        response = self.client.get("/api/chores/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]["description"], "Mow the lawn")

    def test_edit_chore(self):
        new_values = {
            "description": "Mow the front lawn",
            "due_date": "2026-10-25",
            "status": "in_progress",
            "points": 4,
        }
        response = self.client.put(
            f"/api/chores/{self.chore.id}/",
            new_values,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)

        # The same chore was changed, not replaced by a new one
        self.assertEqual(Chore.objects.count(), 1)
        saved = Chore.objects.get(id=self.chore.id)
        self.assertEqual(saved.description, "Mow the front lawn")
        self.assertEqual(saved.due_date, datetime.date(2026, 10, 25))
        self.assertEqual(saved.status, "in_progress")
        self.assertEqual(saved.points, 4)

    def test_edit_chore_with_bad_status(self):
        new_values = {
            "description": "Mow the lawn",
            "due_date": "2026-10-24",
            "status": "not_a_status",
            "points": 2,
        }
        response = self.client.put(
            f"/api/chores/{self.chore.id}/",
            new_values,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)
        saved = Chore.objects.get(id=self.chore.id)
        self.assertEqual(saved.status, "todo")

    def test_edit_missing_chore(self):
        response = self.client.put(
            "/api/chores/999/",
            {},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 404)
