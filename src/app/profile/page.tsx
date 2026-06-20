import { redirect } from "next/navigation";
import ProfileForm from "@/components/ProfileForm";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  if (!supabaseConfigured()) {
    return (
      <div className="mx-auto max-w-md pt-10 text-center text-muted-foreground">
        Add your Supabase keys to <code>.env.local</code> to edit your profile.
      </div>
    );
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data } = await supabase.from("profiles").select("*").eq("id", auth.user.id).single();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Your profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        This is your fellow page — your projects and impact show up here for future employers and orgs.
      </p>
      <div className="mt-6">
        <ProfileForm userId={auth.user.id} profile={(data as Profile) ?? null} />
      </div>
    </div>
  );
}
