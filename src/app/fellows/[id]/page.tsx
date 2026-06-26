import { notFound } from "next/navigation";
import AnimatedCard from "@/components/AnimatedCard";
import Avatar from "@/components/Avatar";
import { getDeployments } from "@/lib/data";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Project, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export default async function FellowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!supabaseConfigured()) notFound();

  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  if (!profile) {
    return (
      <div className="mx-auto max-w-md pt-20 text-center">
        <h1 className="text-xl font-semibold">Profile not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This fellow hasn't set up their profile yet.
        </p>
      </div>
    );
  }
  const p = profile as Profile;

  const { data: projData } = await supabase.from("projects").select("*").eq("author_id", id).order("created_at", { ascending: false });
  const projects = (projData as Project[]) ?? [];

  // Impact = deployments of this fellow's projects.
  const ids = new Set(projects.map((x) => x.id));
  const deployments = (await getDeployments()).filter((d) => ids.has(d.project_id));
  const hours = deployments.reduce((s, d) => s + (d.hours_saved || 0), 0);
  const orgs = new Set(deployments.map((d) => d.org_name).filter(Boolean));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-4">
        <Avatar url={p.avatar_url} name={p.full_name} size={72} />
        <div>
          <h1 className="text-2xl font-bold">{p.full_name || "Fellow"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {[p.cohort && `Cohort ${p.cohort}`, p.host_org, p.sector].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>
      {(p.linkedin_url || p.website) && (
        <div className="mt-3 flex gap-3 text-sm">
          {p.linkedin_url && (
            <a href={p.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn</a>
          )}
          {p.website && (
            <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Website</a>
          )}
        </div>
      )}
      {p.bio && <p className="mt-3 whitespace-pre-wrap">{p.bio}</p>}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat value={projects.length} label="Projects published" />
        <Stat value={deployments.length} label="Times deployed" />
        <Stat value={hours.toLocaleString()} label="Hours saved" />
        <Stat value={orgs.size} label="Orgs helped" />
      </div>

      <h2 className="mt-10 text-lg font-semibold">Projects</h2>
      {projects.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">No projects published yet.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {projects.map((proj, i) => (
            <AnimatedCard key={proj.id} project={proj} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
