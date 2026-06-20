import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Project, Review, Deployment } from "@/lib/types";

export type ProjectFilters = {
  q?: string;
  sector?: string;
  difficulty?: string;
  setup?: string;
  org?: string;
};

// Returns [] on any failure (unconfigured env, missing table) so pages never crash.
export async function getProjects(filters: ProjectFilters = {}): Promise<Project[]> {
  if (!supabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    let query = supabase.from("projects").select("*").order("created_at", { ascending: false });

    // ilike so canonical chips, custom sectors, and typed partials ("similar ones") all match.
    if (filters.sector) query = query.ilike("sector", `%${filters.sector}%`);
    if (filters.difficulty) query = query.eq("difficulty", filters.difficulty);
    if (filters.setup) query = query.eq("setup_time", filters.setup);
    if (filters.org) query = query.eq("org_size", filters.org);
    if (filters.q) {
      const term = `%${filters.q}%`;
      // Include sector so typing a sector (incl. a custom "Other" one) surfaces it + similar.
      query = query.or(
        `name.ilike.${term},one_liner.ilike.${term},problem.ilike.${term},solution.ilike.${term},sector.ilike.${term}`
      );
    }

    const { data, error } = await query;
    if (error) return [];
    return (data as Project[]) ?? [];
  } catch {
    return [];
  }
}

export async function getProject(id: string): Promise<Project | null> {
  if (!supabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("projects").select("*").eq("id", id).single();
    return (data as Project) ?? null;
  } catch {
    return null;
  }
}

export async function getReviews(projectId: string): Promise<Review[]> {
  if (!supabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    return (data as Review[]) ?? [];
  } catch {
    return [];
  }
}

export async function getDeployments(): Promise<Deployment[]> {
  if (!supabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("deployments").select("*");
    return (data as Deployment[]) ?? [];
  } catch {
    return [];
  }
}
