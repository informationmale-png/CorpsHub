"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SECTOR_OPTIONS, OTHER_SECTOR, DIFFICULTIES, SETUP_TIMES, ORG_SIZES } from "@/lib/constants";

const FIELDS = [
  { id: "name", label: "Project name", type: "input", placeholder: "e.g. Food Bank Intake Reporter" },
  { id: "one_liner", label: "One-sentence description", type: "input", placeholder: "What it does, in plain English." },
  { id: "problem", label: "What problem existed before this tool?", type: "textarea", placeholder: "Tell it like a story — what was happening, who was affected." },
  { id: "solution", label: "What does the solution do?", type: "textarea", placeholder: "Written for a nonprofit director, not a developer. No jargon." },
  { id: "setup_needs", label: "What does someone need to set this up?", type: "textarea", placeholder: "Prerequisites in plain English (accounts, access, time)." },
  { id: "note_to_next", label: "A note to the next fellow who deploys this", type: "textarea", placeholder: "Human to human. What's the hardest part? What should they budget time for?" },
  { id: "github_url", label: "GitHub link (optional)", type: "input", placeholder: "https://github.com/..." },
] as const;

const SELECTS = [
  { id: "sector", label: "Sector", options: SECTOR_OPTIONS },
  { id: "difficulty", label: "Difficulty", options: DIFFICULTIES },
  { id: "setup_time", label: "Setup time", options: SETUP_TIMES },
  { id: "org_size", label: "Org size it fits", options: ORG_SIZES },
] as const;

export default function SubmitForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({
    sector: SECTOR_OPTIONS[0],
    difficulty: DIFFICULTIES[0],
    setup_time: SETUP_TIMES[0],
    org_size: ORG_SIZES[0],
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (id: string, v: string) => setForm((f) => ({ ...f, [id]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name?.trim()) { setError("Project name is required."); return; }
    setBusy(true);
    setError("");
    try {
      // Resolve a custom "Other" sector into the real sector value.
      const sector = form.sector === OTHER_SECTOR ? (form.custom_sector || "").trim() : form.sector;
      if (form.sector === OTHER_SECTOR && !sector) {
        setError("Type the sector name.");
        setBusy(false);
        return;
      }
      const payload: Record<string, string> = { ...form, sector, author_id: userId };
      delete payload.custom_sector; // not a real column

      const supabase = createClient();
      const { data, error } = await supabase
        .from("projects")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      router.push(`/projects/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save. Try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {FIELDS.map((f) => (
        <div key={f.id}>
          <label className="block text-sm font-medium" htmlFor={f.id}>{f.label}</label>
          {f.type === "textarea" ? (
            <textarea
              id={f.id}
              className="mt-1 min-h-24 w-full rounded-lg border border-border bg-card px-3 py-2 outline-none focus:border-primary"
              placeholder={f.placeholder}
              value={form[f.id] ?? ""}
              onChange={(e) => set(f.id, e.target.value)}
            />
          ) : (
            <input
              id={f.id}
              className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 outline-none focus:border-primary"
              placeholder={f.placeholder}
              value={form[f.id] ?? ""}
              onChange={(e) => set(f.id, e.target.value)}
            />
          )}
        </div>
      ))}

      <div className="grid gap-4 sm:grid-cols-2">
        {SELECTS.map((s) => (
          <div key={s.id}>
            <label className="block text-sm font-medium" htmlFor={s.id}>{s.label}</label>
            <select
              id={s.id}
              className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 outline-none focus:border-primary"
              value={form[s.id]}
              onChange={(e) => set(s.id, e.target.value)}
            >
              {s.options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {form.sector === OTHER_SECTOR && (
        <div>
          <label className="block text-sm font-medium" htmlFor="custom_sector">Name your sector</label>
          <input
            id="custom_sector"
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 outline-none focus:border-primary"
            placeholder="e.g. Refugee Resettlement"
            value={form.custom_sector ?? ""}
            onChange={(e) => set("custom_sector", e.target.value)}
          />
          <p className="mt-1 text-xs text-muted-foreground">Others can find it by typing this in search.</p>
        </div>
      )}

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-primary px-5 py-2.5 font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {busy ? "Publishing…" : "Publish project"}
      </button>
    </form>
  );
}
