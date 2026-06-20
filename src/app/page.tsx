import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { getProjects, getDeployments } from "@/lib/data";
import type { Project } from "@/lib/types";
import { SECTORS, sectorSlug } from "@/lib/constants";

export const dynamic = "force-dynamic";

function Section({ title, subtitle, projects }: { title: string; subtitle: string; projects: Project[] }) {
  if (!projects.length) return null;
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mb-4 text-sm text-muted-foreground">{subtitle}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}

export default async function Home() {
  const [all, deployments] = await Promise.all([getProjects(), getDeployments()]);

  // Trending = most deployed.
  const counts = new Map<string, number>();
  deployments.forEach((d) => counts.set(d.project_id, (counts.get(d.project_id) ?? 0) + 1));
  const trending = [...all]
    .sort((a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0))
    .filter((p) => counts.get(p.id))
    .slice(0, 3);
  const recent = all.slice(0, 3);
  const verified = all.filter((p) => p.verified).slice(0, 3);

  return (
    <div>
      <div className="mx-auto max-w-2xl pt-10 pb-4 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Find a tool that already solves your problem.</h1>
        <p className="mt-3 text-muted-foreground">A living library of everything Claude Corps fellows build at nonprofits.</p>

        <form action="/projects" className="mt-8">
          <input
            type="text"
            name="q"
            placeholder="What problem are you trying to solve?"
            className="w-full rounded-xl border border-border bg-card px-5 py-4 text-lg shadow-sm outline-none focus:border-primary"
            aria-label="Search projects"
          />
        </form>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {SECTORS.map((s) => (
            <Link
              key={s}
              href={`/library/${sectorSlug(s)}`}
              className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground hover:border-primary hover:text-primary"
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {all.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No projects yet.{" "}
          <Link href="/submit" className="text-primary underline">
            Be the first to submit one.
          </Link>
        </div>
      ) : (
        <>
          <Section title="Trending This Month" subtitle="The most-deployed projects right now." projects={trending} />
          <Section title="Recently Added" subtitle="Fresh submissions from fellows wrapping up their year." projects={recent} />
          <Section title="Verified by Anthropic" subtitle="Reviewed, tested, and officially endorsed." projects={verified} />
        </>
      )}
    </div>
  );
}
