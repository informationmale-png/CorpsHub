import Link from "next/link";
import { getProjects } from "@/lib/data";
import { SECTORS, sectorSlug } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const projects = await getProjects();
  const count = (sector: string) => projects.filter((p) => p.sector === sector).length;

  // Sectors fellows typed via "Other" that aren't in the canonical list.
  const known = new Set<string>(SECTORS);
  const custom = [...new Set(projects.map((p) => p.sector).filter((s) => s && !known.has(s)))];

  return (
    <div>
      <h1 className="text-2xl font-bold">The Library</h1>
      <p className="mt-1 text-sm text-muted-foreground">Browse proven nonprofit AI tools by sector — like an app store for nonprofit workflows.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTORS.map((s) => (
          <Link
            key={s}
            href={`/library/${sectorSlug(s)}`}
            className="rounded-xl border border-border bg-card p-5 transition hover:border-primary hover:shadow-sm"
          >
            <h2 className="font-semibold">{s}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{count(s)} {count(s) === 1 ? "project" : "projects"}</p>
          </Link>
        ))}
      </div>

      {custom.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-semibold">Community-added</h2>
          <p className="mb-3 text-sm text-muted-foreground">Sectors fellows named themselves.</p>
          <div className="flex flex-wrap gap-2">
            {custom.map((s) => (
              <Link
                key={s}
                href={`/library/${sectorSlug(s)}`}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-primary hover:text-primary"
              >
                {s} <span className="text-muted-foreground">({count(s)})</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
