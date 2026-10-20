// Allow React state and browser interactions, such as clicks and confirmation dialogs.
"use client";

import { useEffect, useState } from "react";

// Data we expect to receive from the server (DJANGO)
type Chore = { id: number; description: string };


export default function Home() { // Data and behavior of the component are defined here
  // useState remembers data between renders. Each pair contains the current value
  // and a setter: setChores(newList) updates chores and tells React to redraw the page.
  const [chores, setChores] = useState<Chore[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // Django checks this token when we send a deletion request.
  const [csrfToken, setCsrfToken] = useState("");
  const [loading, setLoading] = useState(true);
  // Store the ID being deleted, null means no deletion is in progress.
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState("");
  // Find looks for the chosen ID. ?? uses the first chore if no match is found.
  const selectedChore = chores.find((chore) => chore.id === selectedId) ?? chores[0];

  // Load chores from DJANGO. The empty [] means no dependencies.
  useEffect(() => {
    fetch("/api/chores/")
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const data = await response.json();
        setChores(data.chores);
        setCsrfToken(data.csrfToken);
      })
      .catch(() => setError("Could not load chores."))
      .finally(() => setLoading(false));
  }, []);

  async function deleteChore(chore: Chore) {
    // Ask for confirmation before deleting. If the user clicks Cancel, return early.
    if (!window.confirm(`Delete "${chore.description}"? This cannot be undone.`))
      {  
        return;
      }
    setDeleting(chore.id);
    setError("");
    try {
      // ${chore.id} inserts the selected ID into the URL, for example /api/chores/4/.
      const response = await fetch(`/api/chores/${chore.id}/`, {
        method: "DELETE",
        headers: { "X-CSRFToken": csrfToken },
      });
      if (!response.ok) throw new Error();
      // setter function, returns a new list without the deleted chore.
      setChores((current) => current.filter((item) => item.id !== chore.id));
    } catch {
      setError("Could not delete chore. Please try again.");
    } finally {
      // Re-enable the controls after either success or failure.
      setDeleting(null);
    }
  }

  // The visible part of the component is defined here, which is what the user sees and interacts with
  // This is JSX: HTML-like tags with JavaScript expressions inside {braces}.
  // className is React's spelling of HTML's class attribute; these classes add styling.
  return ( 
    <main className="p-4">
      {loading && <p>Loading chores...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && chores.length === 0 && <p>No chores.</p>}
      {/* Show the dropdown only when chores exist. value controls its selection;
          onChange saves the selected ID. Number converts the form's text value to a number.
          selectedChore?.id safely reads the ID even when selectedChore is undefined. */}
      {chores.length > 0 && (
        <select
          aria-label="Chore to delete"
          value={selectedChore?.id ?? ""}
          onChange={(event) => setSelectedId(Number(event.target.value))}
          disabled={deleting !== null}
          className="mr-3 border p-1"
        >
          {/* map creates one option per chore. key gives React a stable ID to track
              each option, value is the ID, while the description is the visible label. */}
          {chores.map((chore) => <option key={chore.id} value={chore.id}>{chore.description}</option>)}
        </select>
      )}
    
      <button
        className="rounded border px-3 py-1 disabled:opacity-50"
        disabled={!selectedChore || deleting !== null}
        onClick={() => selectedChore && deleteChore(selectedChore)}
      >
        Delete chore
      </button>
    </main>
  );
}
