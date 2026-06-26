# CorpsHub
### AI tools for nonprofits, built by Claude Corps fellows.

**→ [corpshub.vercel.app](https://corpshub.vercel.app)**

A searchable library of every project Claude Corps fellows have built at nonprofits. Before you build from scratch, check if a fellow already solved it.

---

## Why this exists

Every year, hundreds of Claude Corps fellows build AI tools for nonprofits. Most reinvent the same solutions — intake forms, eligibility screeners, volunteer matching, reporting dashboards. CorpsHub makes sure the next fellow starts with a head start, not from scratch.

## For fellows

- **Browse by sector** — Food Security, Housing, Public Health, Education, 15+ more
- **Search projects** — find what solves your nonprofit's problem
- **Filter by difficulty** — Beginner to Advanced
- **Read deployment notes** — each project has "what someone needs to set this up" and "a note to the next fellow"
- **Submit your project** — leave your legacy for the next cohort

## For nonprofits

- **Find proven tools** — projects are written for humans, not developers
- **Leave reviews** — tell the next org what worked
- **Track deployments** — log when your org adopts a project

## The impact tracking

Every project tracks deployments across nonprofits. Fellow profiles auto-calculate:
- Projects published
- Times deployed
- Hours saved
- Orgs helped

---

## Built with

Next.js 16 · React 19 · Tailwind 4 · Supabase (Postgres + Auth) · TypeScript · Vercel

## Quick start

```bash
npm install
npm run dev           # local at localhost:3000
```

Requires Supabase keys in `.env.local` — see `supabase/schema.sql` for the DB schema.

## Deploy your own

Push this repo to Vercel, set the two `NEXT_PUBLIC_SUPABASE_*` env vars, and you're live.

---

**[corpshub.vercel.app](https://corpshub.vercel.app)** — built during Claude Corps by [@informationmale-png](https://github.com/informationmale-png).
