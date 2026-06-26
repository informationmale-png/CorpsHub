import type { Metadata } from "next";
import { Public_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

// Public Sans = the US government design-system font (civic, readable, accessible).
const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-public-sans", display: "swap" });
// Fraunces = warm editorial serif for headings — makes the story sections stop the scroll.
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

export const metadata: Metadata = {
  title: "CorpsHub — GitHub for Claude Corps",
  description: "A living library of the AI tools Claude Corps fellows build at nonprofits.",
  icons: [{ url: "/favicon.svg", type: "image/svg+xml" }],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let email: string | null = null;
  if (supabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      email = data.user?.email ?? null;
    } catch {
      email = null;
    }
  }

  return (
    <html lang="en" className={`${publicSans.variable} ${fraunces.variable}`}>
      <body className="min-h-screen">
        <Nav email={email} />
        {!supabaseConfigured() && (
          <div className="bg-accent border-b border-border px-4 py-2 text-center text-sm">
            Supabase isn&apos;t configured yet — add your keys to <code>.env.local</code> and restart to enable saving &amp; sign-in.
          </div>
        )}
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
          CorpsHub — built for Claude Corps fellows.
        </footer>
      </body>
    </html>
  );
}
