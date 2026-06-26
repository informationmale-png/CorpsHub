import Skeleton from "@/components/ui/skeleton";

export default function LibraryLoading() {
  return (
    <div>
      <Skeleton className="mb-1 h-8 w-48" />
      <Skeleton className="mb-6 h-4 w-96" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <Skeleton className="mb-2 h-5 w-2/3" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
