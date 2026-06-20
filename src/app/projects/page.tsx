import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/data";
import { SECTORS, DIFFICULTIES, SETUP_TIMES, ORG_SIZES } from "@/lib/constants";

export const dynamic = "force-dynamic";

type SP = { q?: string; sector?: string; difficulty?: string; setup?: string; org?: string };

function buildHref(base: SP, key: keyof SP, value: string) {
  const next: SP = { ...base };
  if (next[key] === value) delete next[key];
  else next[key] = value;
  const qs = new URLSearchParams(next as Record<string, string>).toString();
  return qs ? `/projects?${qs}` : "/projects";
}

function FilterRow({ label, options, paramKey, current }: { label: string; options: readonly string[]; paramKey: keyof SP; current: SP }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {options.map((opt) => {
        const active = current[paramKey] === opt;
        return (
          <Link
            key={opt}
            href={buildHref(current, paramKey, opt)}
            className={`rounded-full px-3 py-1 text-sm transition ${
              active ? "bg-primary text-white" : "border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {opt}
          </Link>
        );
      })}
    </div>
  );
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const projects = await getProjects(sp);

  // Community-added sectors (typed via "Other") become extra filter chips.
  const all = await getProjects();
  const known = new Set<string>(SECTORS);
  const customSectors = [...new Set(all.map((p) => p.sector).filter((s) => s && !known.has(s)))];

  return (
    <div>
      <form action="/projects" className="mb-6">
        <input
          type="text"
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="What problem are you trying to solve?"
          className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-primary"
          aria-label="Search projects"
        />
        {/* preserve active filters when searching */}
        {sp.sector && <input type="hidden" name="sector" value={sp.sector} />}
        {sp.difficulty && <input type="hidden" name="difficulty" value={sp.difficulty} />}
        {sp.setup && <input type="hidden" name="setup" value={sp.setup} />}
        {sp.org && <input type="hidden" name="org" value={sp.org} />}
      </form>

      <div className="mb-8 space-y-3 rounded-xl border border-border bg-card p-4">
        <FilterRow label="Sector" options={[...SECTORS, ...customSectors]} paramKey="sector" current={sp} />
        <FilterRow label="Setup" options={SETUP_TIMES} paramKey="setup" current={sp} />
        <FilterRow label="Level" options={DIFFICULTIES} paramKey="difficulty" current={sp} />
        <FilterRow label="Org size" options={ORG_SIZES} paramKey="org" current={sp} />
        <form action="/projects" className="flex flex-wrap items-center gap-2">
          <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">Other</span>
          <input
            type="text"
            name="sector"
            defaultValue={sp.sector && !known.has(sp.sector) ? sp.sector : ""}
            placeholder="Type a sector…"
            className="rounded-full border border-border bg-card px-3 py-1 text-sm outline-none focus:border-primary"
            aria-label="Filter by a custom sector"
          />
          {sp.q && <input type="hidden" name="q" value={sp.q} />}
          {sp.difficulty && <input type="hidden" name="difficulty" value={sp.difficulty} />}
          {sp.setup && <input type="hidden" name="setup" value={sp.setup} />}
          {sp.org && <input type="hidden" name="org" value={sp.org} />}
          <button type="submit" className="rounded-full bg-primary px-3 py-1 text-sm text-white hover:opacity-90">Filter</button>
        </form>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {projects.length} {projects.length === 1 ? "project" : "projects"}
        {sp.q ? ` for “${sp.q}”` : ""}
      </p>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          Nothing matches yet. Try clearing filters, or{" "}
          <Link href="/submit" className="text-primary underline">submit a project</Link>.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
