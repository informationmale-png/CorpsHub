"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ReviewForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) {
      setError("Pick a star rating.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("reviews").insert({
        project_id: projectId,
        rating,
        author_name: authorName,
        org_name: orgName,
        body,
      });
      if (error) throw error;
      setRating(0);
      setAuthorName("");
      setOrgName("");
      setBody("");
      setDone(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your review.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 rounded-xl border border-border bg-card p-4">
      <p className="text-sm font-medium">Used this at your org? Leave a review.</p>

      <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="text-2xl leading-none"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            aria-pressed={rating === n}
          >
            <span className={(hover || rating) >= n ? "text-primary" : "text-border"}>★</span>
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="rounded-lg border border-border bg-card px-3 py-2 outline-none focus:border-primary"
          placeholder="Your name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />
        <input
          className="rounded-lg border border-border bg-card px-3 py-2 outline-none focus:border-primary"
          placeholder="Organization"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />
      </div>

      <textarea
        className="min-h-20 w-full rounded-lg border border-border bg-card px-3 py-2 outline-none focus:border-primary"
        placeholder="How did it go? What changed for your team?"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      {error && <p className="text-sm text-rose-600">{error}</p>}
      {done && !error && <p className="text-sm text-primary">Thanks — your review is posted.</p>}

      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {busy ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}
