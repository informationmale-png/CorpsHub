import Skeleton from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div>
      <Skeleton className="mb-1 h-8 w-56" />
      <Skeleton className="mb-6 h-4 w-96" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 text-center">
            <Skeleton className="mx-auto mb-1 h-8 w-16" />
            <Skeleton className="mx-auto h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}
