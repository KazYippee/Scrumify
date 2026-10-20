"use client";

import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/";

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
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [chores, setChores] = useState<Chore[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    description: "",
    due_date: "",
    status: "todo",
    points: 0,
  });
  const [error, setError] = useState("");

  // When the page opens, check if the user signed in before
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      loadChores(savedToken);
    }
    // The empty [] means this only runs once, when the page opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get the signed-in user's chores from the server
  function loadChores(userToken: string) {
    fetch(API_URL + "chores/", {
      headers: { Authorization: "Token " + userToken },
    })
      .then((response) => {
        if (response.status === 401) {
          // The saved token no longer works, so sign out
          logOut();
          return;
        }
        return response.json().then((data) => {
          setToken(userToken);
          setChores(data);
        });
      })
      .catch(() => setError("Could not load chores. Is the Django server running?"));
  }

  async function logIn() {
    const response = await fetch(API_URL + "login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    });

    if (!response.ok) {
      setError("Wrong username or password.");
      return;
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    loadChores(data.token);
    setPassword("");
    setError("");
  }

  function logOut() {
    localStorage.removeItem("token");
    setToken("");
    setChores([]);
    setEditingId(null);
  }

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
    const response = await fetch(API_URL + "chores/" + id + "/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + token,
      },
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

  if (!token) {
    return (
      <main className="mx-auto w-full max-w-2xl p-8">
        <h1 className="mb-6 text-3xl font-bold">Sign in</h1>

        {error && <p className="mb-4 text-red-600">{error}</p>}

        <div className="flex flex-col gap-2">
          <label>
            Username
            <input
              className="ml-2 border px-1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              className="ml-2 border px-1"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <div>
            <button className="rounded border px-3 py-1" onClick={logIn}>
              Sign in
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Chores</h1>
        <button className="rounded border px-3 py-1" onClick={logOut}>
          Sign out
        </button>
      </div>

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
