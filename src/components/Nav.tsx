"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Nav({ email }: { email: string | null }) {
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold text-lg">
          Corps<span className="text-primary">Hub</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/projects" className="hover:text-primary">Browse</Link>
          <Link href="/library" className="hover:text-primary">Library</Link>
          <Link href="/dashboard" className="hover:text-primary">Impact</Link>
          {email ? (
            <>
              <Link href="/profile" className="hover:text-primary">Profile</Link>
              <Link href="/submit" className="rounded-md bg-primary px-3 py-1.5 font-medium text-white hover:opacity-90">
                Submit
              </Link>
              <button onClick={signOut} className="text-muted-foreground hover:text-foreground">Sign out</button>
            </>
          ) : (
            <Link href="/login" className="rounded-md bg-primary px-3 py-1.5 font-medium text-white hover:opacity-90">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
