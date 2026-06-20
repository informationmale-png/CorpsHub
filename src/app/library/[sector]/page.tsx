import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/data";
import { sectorFromSlug, sectorSlug } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function SectorPage({ params }: { params: Promise<{ sector: string }> }) {
  const { sector: slug } = await params;
  let sector: string | undefined = sectorFromSlug(slug);
  let projects;
  if (sector) {
    projects = await getProjects({ sector });
  } else {
    // Community-added (custom "Other") sector — resolve by slug against stored values.
    const all = await getProjects();
    const matches = all.filter((p) => p.sector && sectorSlug(p.sector) === slug);
    if (matches.length === 0) notFound();
    sector = matches[0].sector;
    projects = matches;
  }

  return (
    <div>
      <Link href="/library" className="text-sm text-muted-foreground hover:text-primary">← All sectors</Link>
      <h1 className="mt-3 text-2xl font-bold">{sector}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {projects.length} {projects.length === 1 ? "project" : "projects"} proven to work in {sector.toLowerCase()}.
      </p>

      {projects.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          Nothing here yet.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
