"use client";

import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/lib/types";

export default function AnimatedCard({ project, index }: { project: Project; index: number }) {
  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-3"
      style={{ animationDelay: `${index * 75}ms`, animationFillMode: "backwards" }}
    >
      <ProjectCard project={project} />
    </div>
  );
}
