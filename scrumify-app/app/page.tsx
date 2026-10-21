// Allow React state and browser interactions, such as refresh button clicks.
"use client";

import { useEffect, useState } from "react";

// Data we expect to receive from the server (DJANGO)
type Chore = {
  id: number;
  description: string;
  due_date: string;
  status: "todo" | "in_progress" | "done";
  points: number;
};

const statusLabels = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};


export default function Home() { // Data and behavior of the component are defined here
  // useState remembers data between renders. Each pair contains the current value
  // and a setter: setChores(newList) updates chores and tells React to redraw the page.
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [error, setError] = useState("");

  // Read saved chores on opening the app and when returning from the admin/API.
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
      } catch (error) {
        if (active && !(error instanceof DOMException && error.name === "AbortError")) {
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

  // The visible part of the component is defined here, which is what the user sees and interacts with
  // This is JSX: HTML-like tags with JavaScript expressions inside {braces}.
  // className is React's spelling of HTML's class attribute; these classes add styling.
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
              <h2 className="break-words text-lg font-medium">{chore.description}</h2>
              <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="font-semibold">Due date</dt>
                  <dd><time dateTime={chore.due_date}>{chore.due_date}</time></dd>
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
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
