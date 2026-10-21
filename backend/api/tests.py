import datetime

from django.test import Client, TestCase
from django.urls import reverse
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


class ChoreDeleteTests(TestCase):
    def setUp(self):
        self.chore = Chore.objects.create(
            description="Wash dishes", due_date=datetime.date(2026, 10, 21)
        )
        self.delete_url = reverse("chore-delete", args=[self.chore.pk])

    def test_list_returns_chores(self):
        response = self.client.get(reverse("chore-list"))
        self.assertEqual(response.json()["chores"], [
            {"id": self.chore.pk, "description": self.chore.description}
        ])

    def test_get_cannot_delete(self):
        self.assertEqual(self.client.get(self.delete_url).status_code, 405)
        self.assertTrue(Chore.objects.filter(pk=self.chore.pk).exists())

    def test_delete_updates_list_and_preserves_other_chores(self):
        other = Chore.objects.create(
            description="Vacuum", due_date=datetime.date(2026, 10, 22)
        )
        client = Client(enforce_csrf_checks=True)
        token = client.get(reverse("chore-list")).json()["csrfToken"]
        response = client.delete(self.delete_url, HTTP_X_CSRFTOKEN=token,
                                 HTTP_ORIGIN="http://localhost:3000")
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Chore.objects.filter(pk=self.chore.pk).exists())
        self.assertEqual(client.get(reverse("chore-list")).json()["chores"], [
            {"id": other.pk, "description": other.description}
        ])

    def test_missing_chore_returns_404(self):
        url = reverse("chore-delete", args=[self.chore.pk + 1])
        self.assertEqual(self.client.delete(url).status_code, 404)

    def test_delete_requires_csrf_token(self):
        response = Client(enforce_csrf_checks=True).delete(self.delete_url)
        self.assertEqual(response.status_code, 403)
        self.assertTrue(Chore.objects.filter(pk=self.chore.pk).exists())
