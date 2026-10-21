"use client";

import { useEffect, useState } from "react";

type Chore = {
  id: number;
  description: string;
  due_date: string;
  status: "todo" | "in_progress" | "done";
  points: number;
};

const statusLabels: Record<Chore["status"], string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

export default function Home() {
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    description: "",
    due_date: "",
    status: "todo" as Chore["status"],
    points: 0,
  });

  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;

    async function loadChores() {
      controller?.abort();
      const requestController = new AbortController();
      controller = requestController;
      try {
        const response = await fetch("/api/chores/", {
          cache: "no-store",
          signal: requestController.signal,
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (!active || requestController.signal.aborted) return;
        setChores(data.chores);
        setError("");
      } catch (err) {
        if (active && !(err instanceof DOMException && err.name === "AbortError")) {
          setError("Could not load chores. Select Refresh chores to try again.");
        }
      } finally {
        if (active && !requestController.signal.aborted) setLoading(false);
      }
    }

    function refreshWhenVisible() {
      if (document.visibilityState === "visible") void loadChores();
    }

    void loadChores();
    window.addEventListener("focus", loadChores);
    window.addEventListener("pageshow", loadChores);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      active = false;
      controller?.abort();
      window.removeEventListener("focus", loadChores);
      window.removeEventListener("pageshow", loadChores);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [refreshVersion]);

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
    const response = await fetch(`/api/chores/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setError("Could not save the chore. Check that every field is filled in.");
      return;
    }

    const updatedChore: Chore = await response.json();
    setChores(chores.map((chore) => (chore.id === id ? updatedChore : chore)));
    setEditingId(null);
    setError("");
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Current chores</h1>
        <button
          onClick={() => setRefreshVersion((current) => current + 1)}
          className="rounded border px-3 py-1"
        >
          Refresh chores
        </button>
      </div>
      {loading && <p>Loading chores...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && chores.length === 0 && <p>No chores saved yet.</p>}
      {chores.length > 0 && (
        <ul className="space-y-3" aria-label="Current chores">
          {chores.map((chore) => (
            <li key={chore.id} className="rounded border p-4">
              {editingId === chore.id ? (
                <div className="flex flex-col gap-2">
                  <label>
                    Description
                    <input
                      className="ml-2 border px-1"
                      value={form.description}
                      onChange={(event) => setForm({ ...form, description: event.target.value })}
                    />
                  </label>
                  <label>
                    Due date
                    <input
                      className="ml-2 border px-1"
                      type="date"
                      value={form.due_date}
                      onChange={(event) => setForm({ ...form, due_date: event.target.value })}
                    />
                  </label>
                  <label>
                    Status
                    <select
                      className="ml-2 border px-1"
                      value={form.status}
                      onChange={(event) =>
                        setForm({ ...form, status: event.target.value as Chore["status"] })
                      }
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
                      onChange={(event) => setForm({ ...form, points: Number(event.target.value) })}
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
                <>
                  <h2 className="break-words text-lg font-medium">{chore.description}</h2>
                  <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="font-semibold">Due date</dt>
                      <dd>
                        <time dateTime={chore.due_date}>{chore.due_date}</time>
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Status</dt>
                      <dd>{statusLabels[chore.status]}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Points</dt>
                      <dd>{chore.points}</dd>
                    </div>
                  </dl>
                  <button className="mt-2 rounded border px-3 py-1" onClick={() => startEditing(chore)}>
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
