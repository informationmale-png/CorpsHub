"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const supabase = createClient();
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        // If email confirmation is on, there's no session yet.
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setMsg("Account created. Check your email to confirm, then sign in.");
          setMode("signin");
          setBusy(false);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.push("/submit");
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm pt-8">
      <h1 className="text-2xl font-bold">{mode === "signin" ? "Sign in" : "Create your fellow account"}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {mode === "signin" ? "Welcome back." : "So your projects are tied to you and show up on your profile."}
      </p>

      <form onSubmit={submit} className="mt-6 space-y-3">
        {mode === "signup" && (
          <input
            className="w-full rounded-lg border border-border bg-card px-3 py-2 outline-none focus:border-primary"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          className="w-full rounded-lg border border-border bg-card px-3 py-2 outline-none focus:border-primary"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full rounded-lg border border-border bg-card px-3 py-2 outline-none focus:border-primary"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-primary py-2.5 font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      {msg && <p className="mt-3 text-sm text-primary">{msg}</p>}

      <button
        onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMsg(""); }}
        className="mt-4 text-sm text-muted-foreground hover:text-primary"
      >
        {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>

      <p className="mt-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">← Back home</Link>
      </p>
    </div>
  );
}
