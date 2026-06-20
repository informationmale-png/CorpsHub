import { redirect } from "next/navigation";
import Link from "next/link";
import SubmitForm from "@/components/SubmitForm";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SubmitPage() {
  if (!supabaseConfigured()) {
    return (
      <div className="mx-auto max-w-md pt-10 text-center text-muted-foreground">
        Add your Supabase keys to <code>.env.local</code> to enable submissions.
      </div>
    );
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Submit your project</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Publish what you built before you leave, so the next fellow has a head start.{" "}
        <Link href="/projects" className="text-primary underline">See examples</Link>.
      </p>
      <div className="mt-6">
        <SubmitForm userId={data.user.id} />
      </div>
    </div>
  );
}
