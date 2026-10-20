"use client";

import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/chores/";

type Chore = {
  id: number;
  description: string;
  due_date: string;
  status: string;
  points: number;
};

const STATUS_LABELS: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

export default function Home() {
  const [chores, setChores] = useState<Chore[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    description: "",
    due_date: "",
    status: "todo",
    points: 0,
  });
  const [error, setError] = useState("");

  // Load all chores from the server when the page first opens
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setChores(data))
      .catch(() => setError("Could not load chores. Is the Django server running?"));
  }, []);

  function startEditing(chore: Chore) {
    setEditingId(chore.id);
    setForm({
      description: chore.description,
      due_date: chore.due_date,
      status: chore.status,
      points: chore.points,
    });
    setError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setError("");
  }

  async function saveChore(id: number) {
    const response = await fetch(API_URL + id + "/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setError("Could not save the chore. Check that every field is filled in.");
      return;
    }

    // Swap the old chore in the list for the updated one the server sent back
    const updatedChore = await response.json();
    setChores(chores.map((chore) => (chore.id === id ? updatedChore : chore)));
    setEditingId(null);
    setError("");
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Chores</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      {chores.length === 0 && !error && (
        <p>No chores yet. Add some on the Django admin page.</p>
      )}

      <ul className="flex flex-col gap-4">
        {chores.map((chore) => (
          <li key={chore.id} className="rounded border p-4">
            {editingId === chore.id ? (
              <div className="flex flex-col gap-2">
                <label>
                  Description
                  <input
                    className="ml-2 border px-1"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </label>
                <label>
                  Due date
                  <input
                    className="ml-2 border px-1"
                    type="date"
                    value={form.due_date}
                    onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                  />
                </label>
                <label>
                  Status
                  <select
                    className="ml-2 border px-1"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </label>
                <label>
                  Points
                  <input
                    className="ml-2 border px-1"
                    type="number"
                    value={form.points}
                    onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                  />
                </label>
                <div className="flex gap-2">
                  <button className="rounded border px-3 py-1" onClick={() => saveChore(chore.id)}>
                    Save
                  </button>
                  <button className="rounded border px-3 py-1" onClick={cancelEditing}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-semibold">{chore.description}</p>
                <p>Due: {chore.due_date}</p>
                <p>Status: {STATUS_LABELS[chore.status]}</p>
                <p>Points: {chore.points}</p>
                <button className="mt-2 rounded border px-3 py-1" onClick={() => startEditing(chore)}>
                  Edit
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
