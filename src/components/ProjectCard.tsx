import Link from "next/link";
import type { Project } from "@/lib/types";

const difficultyColor: Record<string, string> = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-amber-100 text-amber-800",
  Advanced: "bg-rose-100 text-rose-800",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-tight">{project.name}</h3>
        {project.verified && (
          <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-primary">
            ✓ Verified
          </span>
        )}
      </div>
      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{project.one_liner}</p>
      <div className="flex flex-wrap gap-1.5 text-xs">
        {project.sector && (
          <span className="rounded-full border border-border px-2 py-0.5">{project.sector}</span>
        )}
        {project.difficulty && (
          <span className={`rounded-full px-2 py-0.5 ${difficultyColor[project.difficulty] ?? "bg-gray-100 text-gray-700"}`}>
            {project.difficulty}
          </span>
        )}
        {project.setup_time && (
          <span className="rounded-full border border-border px-2 py-0.5 text-muted-foreground">{project.setup_time}</span>
        )}
      </div>
    </Link>
  );
}
