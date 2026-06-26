"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Nav({ email }: { email: string | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(path: string) {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  }

  function closeMenu() { setMenuOpen(false); }

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  const navLinks = (
    <>
      <Link href="/projects" onClick={closeMenu} className={`hover:text-primary ${isActive("/projects") ? "text-primary border-b-2 border-primary" : ""}`}>Browse</Link>
      <Link href="/library" onClick={closeMenu} className={`hover:text-primary ${isActive("/library") ? "text-primary border-b-2 border-primary" : ""}`}>Library</Link>
      <Link href="/dashboard" onClick={closeMenu} className={`hover:text-primary ${isActive("/dashboard") ? "text-primary border-b-2 border-primary" : ""}`}>Impact</Link>
      {email ? (
        <>
          <Link href="/profile" onClick={closeMenu} className={`hover:text-primary ${isActive("/profile") ? "text-primary border-b-2 border-primary" : ""}`}>Profile</Link>
          <Link href="/submit" onClick={closeMenu} className={`rounded-md bg-primary px-3 py-1.5 font-medium text-white transition-all hover:bg-primary/90 active:scale-[0.97] ${isActive("/submit") ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""}`}>
            Submit
          </Link>
          <button onClick={() => { signOut(); closeMenu(); }} className="text-muted-foreground hover:text-foreground">Sign out</button>
        </>
      ) : (
        <Link href="/login" onClick={closeMenu} className={`rounded-md bg-primary px-3 py-1.5 font-medium text-white transition-all hover:bg-primary/90 active:scale-[0.97] ${isActive("/login") ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""}`}>
          Sign in
        </Link>
      )}
    </>
  );

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold text-lg">
          Corps<span className="text-primary">Hub</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-4 text-sm">
          {navLinks}
        </div>

        {/* Hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden flex flex-col gap-1 p-2"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className={`block h-0.5 w-5 bg-foreground transition-transform duration-200 ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-foreground transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-foreground transition-transform duration-200 ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="sm:hidden fixed inset-0 z-20">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMenuOpen(false)} />
          <nav className="absolute right-0 top-0 h-full w-64 bg-card border-l border-border p-6 animate-in slide-in-from-right flex flex-col gap-4 text-sm">
            {navLinks}
          </nav>
        </div>
      )}
    </header>
  );
}
