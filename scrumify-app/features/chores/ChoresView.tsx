// Displays the chores list, refresh button, and loading/error messages.
"use client";

import ChoreCard from "./ChoreCard";
import { useChores } from "./useChores";

export default function ChoresView() {
  // The useChores hook handles the data and requests, this component handles the visible part.
  const { chores, loading, error, refreshChores } = useChores();

  // This is JSX: HTML-like tags with JavaScript expressions inside {braces}.
  // The className attribute is React's spelling of HTML's class attribute, these classes add styling.
  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Current chores</h1>
        <button
          onClick={refreshChores}
          className="rounded border px-3 py-1"
        >
          Refresh chores
        </button>
      </div>
      {/* The && operator displays the message only when the condition before it is true */}
      {loading && <p>Loading chores...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && chores.length === 0 && <p>No chores saved yet.</p>}
      {chores.length > 0 && (
        <ul className="space-y-3" aria-label="Current chores">
          {/* The map function creates a card for each chore. key lets React identify each card by its ID. */}
          {chores.map((chore) => (
            <ChoreCard key={chore.id} chore={chore} />
          ))}
        </ul>
      )}
    </main>
  );
}
