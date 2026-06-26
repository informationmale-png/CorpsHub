import Link from "next/link";
import { notFound } from "next/navigation";
import Collapsible from "@/components/Collapsible";
import Avatar from "@/components/Avatar";
import ReviewForm from "@/components/ReviewForm";
import { getProject, getReviews } from "@/lib/data";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function Stars({ value }: { value: number }) {
  return (
    <span className="text-primary" aria-label={`${value} out of 5`}>
      {"★".repeat(Math.round(value))}
      <span className="text-border">{"★".repeat(5 - Math.round(value))}</span>
    </span>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const reviews = await getReviews(id);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  // Look up the author for the "Built by" byline, and whether the visitor can review.
  let builtBy = "";
  let authorAvatar = "";
  let signedIn = false;
  if (supabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: u } = await supabase.auth.getUser();
      signedIn = !!u.user;
      const { data } = await supabase
        .from("profiles")
        .select("full_name, cohort, host_org, avatar_url")
        .eq("id", project.author_id)
        .single();
      if (data) {
        authorAvatar = data.avatar_url ?? "";
        builtBy = [data.full_name, data.cohort && `Cohort ${data.cohort}`, data.host_org]
          .filter(Boolean)
          .join(" · ");
      }
    } catch {}
  }

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/projects" className="text-sm text-muted-foreground hover:text-primary">← Back to browse</Link>

      <header className="mt-4 border-b border-border pb-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          {project.verified && (
            <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-sm font-medium text-primary">
              ✓ Verified by Anthropic
            </span>
          )}
        </div>
        <p className="mt-2 text-lg text-muted-foreground">{project.one_liner}</p>
        {builtBy && (
          <Link href={`/fellows/${project.author_id}`} className="mt-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <Avatar url={authorAvatar} name={builtBy} size={28} />
            <span>Built by {builtBy}</span>
          </Link>
        )}
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {project.sector && <span className="rounded-full border border-border px-3 py-1">{project.sector}</span>}
          {project.difficulty && <span className="rounded-full border border-border px-3 py-1">{project.difficulty}</span>}
          {project.setup_time && <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">Setup: {project.setup_time}</span>}
          {reviews.length > 0 && (
            <span className="rounded-full border border-border px-3 py-1">
              <Stars value={avg} /> {avg.toFixed(1)} ({reviews.length})
            </span>
          )}
        </div>
        <div className="mt-5 flex gap-3">
          <Link href={`/submit?remix=${project.id}`} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90 active:scale-[0.97]">
            Remix this project
          </Link>
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-all hover:border-primary active:scale-[0.97]">
              View code
            </a>
          )}
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">The Problem</h2>
        <p className="mt-2 whitespace-pre-wrap leading-relaxed">{project.problem || "—"}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">The Solution</h2>
        <p className="mt-2 whitespace-pre-wrap leading-relaxed">{project.solution || "—"}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">What You Need to Set This Up</h2>
        <p className="mt-2 whitespace-pre-wrap leading-relaxed">{project.setup_needs || "—"}</p>
      </section>

      {project.note_to_next && (
        <section className="mt-8 rounded-xl border border-primary/30 bg-accent p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">A note to the next fellow</h2>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed">{project.note_to_next}</p>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Reviews from Orgs That Used It</h2>
        {reviews.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="mt-3 space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-border bg-card p-4">
                <Stars value={r.rating} />
                <p className="mt-2 whitespace-pre-wrap text-sm">{r.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  — {r.author_name}{r.org_name ? `, ${r.org_name}` : ""}
                </p>
              </div>
            ))}
          </div>
        )}

        {signedIn ? (
          <ReviewForm projectId={project.id} />
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            <Link href="/login" className="text-primary underline">Sign in</Link> to leave a review.
          </p>
        )}
      </section>

      <section className="mt-8">
        <Collapsible title="Show Technical Details">
          <dl className="space-y-2">
            <div>
              <dt className="font-medium">Org size</dt>
              <dd className="text-muted-foreground">{project.org_size || "—"}</dd>
            </div>
            <div>
              <dt className="font-medium">Code</dt>
              <dd>
                {project.github_url ? (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    {project.github_url}
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not provided</span>
                )}
              </dd>
            </div>
          </dl>
        </Collapsible>
      </section>
    </article>
  );
}
