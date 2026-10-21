"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Status = "todo" | "in_progress" | "done";

type Chore = {
  id: number;
  description: string;
  due_date: string;
  status: Status;
  points: number;
};

const API = "http://127.0.0.1:8000/api/chores/";

const COLUMNS: { key: Status; label: string }[] = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "done", label: "Done" },
];

function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDue(iso: string, today: string) {
  const [year, month, day] = iso.split("-");
  const label = `${MONTHS[Number(month) - 1]} ${Number(day)}`;
  if (today && year !== today.slice(0, 4)) return `${label}, ${year}`;
  return label;
}

function isLate(iso: string, status: Status, today: string) {
  if (status === "done" || !today) return false;
  return iso < today;
}

async function errorText(res: Response) {
  try {
    const data = await res.json();
    const first = data && typeof data === "object" ? Object.values(data)[0] : null;
    if (Array.isArray(first) && first[0]) return String(first[0]);
    if (typeof first === "string") return first;
  } catch {
    // Response was not JSON.
  }
  return "That didn't work.";
}

export default function Home() {
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [description, setDescription] = useState("");
  const [due, setDue] = useState("");
  const [today, setToday] = useState("");
  const [points, setPoints] = useState("1");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;
    setToday(todayISO());
    setDue(todayISO());

    async function load() {
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error();
        const data = (await res.json()) as Chore[];
        if (!ignore) {
          setChores(data);
          setNote("");
        }
      } catch {
        if (!ignore) {
          setNote("Can't load chores. Is the Django server running?");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const earned = useMemo(
    () =>
      chores
        .filter((chore) => chore.status === "done")
        .reduce((sum, chore) => sum + chore.points, 0),
    [chores],
  );

  async function addChore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = description.trim();
    if (!text || saving) return;

    const value = Math.max(0, Math.floor(Number(points) || 0));
    setSaving(true);
    setNote("");

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: text,
          due_date: due,
          points: value,
          status: "todo",
        }),
      });
      if (!res.ok) throw new Error(await errorText(res));
      const created = (await res.json()) as Chore;
      setChores((current) => [...current, created]);
      setDescription("");
      setPoints("1");
      if (today) setDue(today);
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Couldn't add that chore.");
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(chore: Chore, status: Status) {
    if (status === chore.status) return;
    setChores((current) =>
      current.map((item) => (item.id === chore.id ? { ...item, status } : item)),
    );

    const res = await fetch(`${API}${chore.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      setChores((current) =>
        current.map((item) => (item.id === chore.id ? chore : item)),
      );
      setNote("Couldn't update that chore.");
    }
  }

  async function remove(chore: Chore) {
    if (!window.confirm(`Remove "${chore.description}"?`)) return;
    const previous = chores;
    setChores((current) => current.filter((item) => item.id !== chore.id));

    const res = await fetch(`${API}${chore.id}/`, { method: "DELETE" });
    if (!res.ok) {
      setChores(previous);
      setNote("Couldn't remove that chore.");
    }
  }

  return (
    <div className="page">
      <main className="sheet">
        <header>
          <div>
            <h1>Scrumify</h1>
            <p>House chores</p>
          </div>
          <p className="score">
            {earned} {earned === 1 ? "point" : "points"} done
          </p>
        </header>

        <form className="add" onSubmit={addChore}>
          <label className="grow">
            Chore
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Take out the trash"
              maxLength={255}
              required
            />
          </label>
          <label>
            Due
            <input
              type="date"
              value={due}
              onChange={(event) => setDue(event.target.value)}
              required
            />
          </label>
          <label>
            Points
            <input
              type="number"
              min={0}
              step={1}
              value={points}
              onChange={(event) => setPoints(event.target.value)}
            />
          </label>
          <button type="submit" disabled={saving}>
            {saving ? "Adding" : "Add"}
          </button>
        </form>

        {note ? <p className="note">{note}</p> : null}
        {loading ? <p className="empty">Loading</p> : null}

        <div className="board">
          {COLUMNS.map((column) => {
            const items = chores
              .filter((chore) => chore.status === column.key)
              .sort(
                (a, b) =>
                  a.due_date.localeCompare(b.due_date) || a.id - b.id,
              );

            return (
              <section className="col" key={column.key}>
                <h2>
                  <span className={`dot ${column.key}`} />
                  {column.label}
                  <span className="count">{items.length}</span>
                </h2>
                {!loading && items.length === 0 ? (
                  <p className="empty">Nothing here</p>
                ) : null}
                {items.map((chore) => {
                  const late = isLate(chore.due_date, chore.status, today);
                  return (
                    <article className="chore" key={chore.id}>
                      <h3>{chore.description}</h3>
                      <p className="meta">
                        <span className={late ? "late" : undefined}>
                          {late ? "Late, " : ""}
                          {formatDue(chore.due_date, today)}
                        </span>
                        <span>{chore.points} pts</span>
                      </p>
                      <div className="actions">
                        <select
                          value={chore.status}
                          aria-label={`Status for ${chore.description}`}
                          onChange={(event) =>
                            changeStatus(chore, event.target.value as Status)
                          }
                        >
                          <option value="todo">To do</option>
                          <option value="in_progress">In progress</option>
                          <option value="done">Done</option>
                        </select>
                        <button
                          type="button"
                          className="remove"
                          onClick={() => remove(chore)}
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  );
                })}
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
