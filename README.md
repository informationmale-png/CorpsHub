# CorpsHub
### GitHub for Claude Corps

A living library where Claude Corps fellows publish the AI tools they build at nonprofits — searchable, browseable by sector, and written for humans, not developers — so every future fellow starts with a head start instead of from scratch.

## What's built
- **Homepage** — big "What problem are you trying to solve?" search + sector chips + Trending / Recently Added / Verified sections
- **Browse** (`/projects`) — search + filters (sector, setup time, level, org size)
- **Project page** (`/projects/[id]`) — the 5 sections (Problem, Solution, Setup, Reviews, collapsible Technical) + the note-to-the-next-fellow callout
- **Submit** (`/submit`) — guided form, requires a signed-in fellow
- **Sign in / sign up** (`/login`) — Supabase Auth (fellow accounts)
- **Library** (`/library`) — sectors index + per-sector pages
- **Impact Dashboard** (`/dashboard`) — projects, deployments, states, hours saved, sectors, nonprofits
- **Fellow profiles** (`/fellows/[id]`) — projects + auto-calculated impact

## Stack
Next.js 16 (App Router) · React 19 · Tailwind 4 · Supabase (Postgres + Auth)

## Setup
1. **Supabase:** create a project → Settings → API → copy the Project URL and `anon public` key into `.env.local` (see `.env.local.example`).
2. **Database:** open Supabase → SQL Editor → paste `supabase/schema.sql` → Run.
3. **Auth (for easy local testing):** Authentication → turn off "Confirm email" so sign-ups log in immediately. (Turn back on before going public.)
4. Run it:
   ```bash
   npm install
   npm run dev
   ```
   Open http://localhost:3000

## Deploy
Push to GitHub, import the repo in Vercel, and add the two `NEXT_PUBLIC_SUPABASE_*` env vars. Vercel gives you a live URL.

## Roadmap (next layers)
Remix flow · review & deployment submission UI · nonprofit directory · cohort pages.
