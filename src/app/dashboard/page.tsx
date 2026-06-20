import { getProjects, getDeployments } from "@/lib/data";

export const dynamic = "force-dynamic";

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-center">
      <div className="text-3xl font-bold text-primary">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export default async function DashboardPage() {
  const [projects, deployments] = await Promise.all([getProjects(), getDeployments()]);

  const states = new Set(deployments.map((d) => d.state).filter(Boolean));
  const orgs = new Set(deployments.map((d) => d.org_name).filter(Boolean));
  const sectors = new Set(projects.map((p) => p.sector).filter(Boolean));
  const hours = deployments.reduce((s, d) => s + (d.hours_saved || 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold">Impact Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">The source of truth for what Claude Corps has built — updated as fellows publish and orgs report outcomes.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat value={projects.length} label="Projects in the library" />
        <Stat value={deployments.length} label="Total deployments" />
        <Stat value={states.size} label="States represented" />
        <Stat value={hours.toLocaleString()} label="Estimated staff hours saved" />
        <Stat value={sectors.size} label="Sectors covered" />
        <Stat value={orgs.size} label="Nonprofits helped" />
      </div>
    </div>
  );
}
