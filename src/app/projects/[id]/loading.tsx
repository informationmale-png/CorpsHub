import Skeleton from "@/components/ui/skeleton";

export default function ProjectDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl">
      <Skeleton className="mb-4 h-4 w-32" />
      <header className="border-b border-border pb-6">
        <Skeleton className="mb-3 h-9 w-3/4" />
        <Skeleton className="mb-1 h-6 w-full" />
        <Skeleton className="mb-4 h-6 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-28 rounded-full" />
        </div>
        <div className="mt-5 flex gap-3">
          <Skeleton className="h-10 w-36 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </header>
      <section className="mt-8">
        <Skeleton className="mb-2 h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-5/6" />
      </section>
      <section className="mt-8">
        <Skeleton className="mb-2 h-5 w-28" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-4/5" />
      </section>
      <section className="mt-8">
        <Skeleton className="mb-2 h-5 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-3/4" />
      </section>
      <section className="mt-8">
        <Skeleton className="mb-2 h-5 w-40" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-2/3" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
