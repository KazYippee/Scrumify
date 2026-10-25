// Displays sign-in or the signed-in user's chores, with editing, refreshing, and error messages
"use client";

import ChoreCard from "./ChoreCard";
import ChoreEditor from "./ChoreEditor";
import SignInForm from "./SignInForm";
import { useState } from "react";
import { useAuth } from "./useAuth";
import { useChores } from "./useChores";
import { useToday } from "./useToday";
import type { Chore, ChoreForm } from "./types";

const COLUMNS: { key: Chore["status"]; label: string }[] = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "done", label: "Done" },
];

export default function ChoresView() {
  const { token, signIn, signOut } = useAuth();
  if (token === null) return <p className="page">Checking saved login...</p>;
  if (!token) return <SignInForm onSignIn={signIn} />;

  // A different token creates a fresh list, clearing the previous account's chores and edits
  return <SignedInChores key={token} token={token} onSignOut={signOut} />;
}

function SignedInChores({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  // The useChores hook handles the data and requests, this component handles the visible part
  const { chores, loading, error, refreshChores, saveChore, completeChore, completingId, saving, saveError, clearSaveError } = useChores(token, onSignOut);
  const [editingId, setEditingId] = useState<number | null>(null);
  const today = useToday();
  const earned = chores
    .filter((chore) => chore.status === "done")
    .reduce((sum, chore) => sum + chore.points, 0);

  async function saveEdits(choreId: number, form: ChoreForm) {
    if (await saveChore(choreId, form)) setEditingId(null);
  }

  return (
    <div className="page">
      <main className="sheet">
        <header className="top">
          <div>
            <h1>Scrumify</h1>
            <p>House chores</p>
          </div>
          <p className="score">
            {earned} {earned === 1 ? "point" : "points"} done
          </p>
        </header>
        <div className="tools">
          <button type="button" onClick={onSignOut}>Sign out</button>
          <button type="button" onClick={refreshChores} disabled={saving}>Refresh</button>
        </div>
        {loading && <p className="empty">Loading</p>}
        {error && <p className="note" role="alert">{error}</p>}
        {saveError && <p className="note" role="alert">{saveError}</p>}
        <div className="board">
          {COLUMNS.map((column) => {
            const items = chores
              .filter((chore) => chore.status === column.key)
              .sort((a, b) => a.due_date.localeCompare(b.due_date) || a.id - b.id);

            return (
              <section className="col" key={column.key}>
                <h2>
                  <span className={`dot ${column.key}`} />
                  {column.label}
                  <span className="count">{items.length}</span>
                </h2>
                {!loading && items.length === 0 ? <p className="empty">Nothing here</p> : null}
                <ul>
                  {items.map((chore) => (
                    editingId === chore.id ? (
                      <li className="chore" key={chore.id}>
                        <ChoreEditor
                          chore={chore}
                          saving={saving}
                          onSave={(form) => saveEdits(chore.id, form)}
                          onCancel={() => { setEditingId(null); clearSaveError(); }}
                        />
                      </li>
                    ) : (
                      <ChoreCard
                        key={chore.id}
                        chore={chore}
                        saving={saving}
                        today={today}
                        completingId={completingId}
                        onComplete={completeChore}
                        onEdit={() => { setEditingId(chore.id); clearSaveError(); }}
                      />
                    )
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
