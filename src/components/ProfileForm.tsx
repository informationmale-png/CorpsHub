"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Avatar from "@/components/Avatar";
import type { Profile } from "@/lib/types";

export default function ProfileForm({ userId, profile }: { userId: string; profile: Profile | null }) {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    cohort: profile?.cohort ?? "",
    host_org: profile?.host_org ?? "",
    sector: profile?.sector ?? "",
    bio: profile?.bio ?? "",
    linkedin_url: profile?.linkedin_url ?? "",
    website: profile?.website ?? "",
  });
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onPickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg("");
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/avatar.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      // cache-bust so the new image shows immediately
      setAvatarUrl(`${data.publicUrl}?t=${Date.now()}`);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        ...form,
        avatar_url: avatarUrl.split("?")[0], // store clean URL
      });
      if (error) throw error;
      setMsg("Saved.");
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="flex items-center gap-4">
        <Avatar url={avatarUrl} name={form.full_name} size={72} />
        <div>
          <label className="inline-block cursor-pointer rounded-lg border border-border bg-card px-3 py-2 text-sm hover:border-primary">
            {uploading ? "Uploading…" : "Upload photo"}
            <input type="file" accept="image/*" className="hidden" onChange={onPickPhoto} disabled={uploading} />
          </label>
          <p className="mt-1 text-xs text-muted-foreground">JPG/PNG, square looks best.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" value={form.full_name} onChange={(v) => set("full_name", v)} />
        <Field label="Cohort" value={form.cohort} onChange={(v) => set("cohort", v)} placeholder="e.g. 1" />
        <Field label="Host org" value={form.host_org} onChange={(v) => set("host_org", v)} />
        <Field label="Sector you worked in" value={form.sector} onChange={(v) => set("sector", v)} />
        <Field label="LinkedIn URL" value={form.linkedin_url} onChange={(v) => set("linkedin_url", v)} placeholder="https://linkedin.com/in/…" />
        <Field label="Website" value={form.website} onChange={(v) => set("website", v)} placeholder="https://…" />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          className="mt-1 min-h-24 w-full rounded-lg border border-border bg-card px-3 py-2 outline-none focus:border-primary"
          placeholder="A few lines about you and your work."
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-primary px-5 py-2.5 font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save profile"}
        </button>
        <Link href={`/fellows/${userId}`} className="text-sm text-muted-foreground hover:text-primary">
          View public profile →
        </Link>
        {msg && <span className="text-sm text-primary">{msg}</span>}
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 outline-none focus:border-primary"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
