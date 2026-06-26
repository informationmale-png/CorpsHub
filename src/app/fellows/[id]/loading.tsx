import Skeleton from "@/components/ui/skeleton";

export default function FellowLoading() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-4">
        <Skeleton className="h-18 w-18 rounded-full" />
        <div>
          <Skeleton className="mb-1 h-7 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 text-center">
            <Skeleton className="mx-auto mb-1 h-7 w-12" />
            <Skeleton className="mx-auto h-3 w-24" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-10 mb-4 h-5 w-24" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <Skeleton className="mb-2 h-5 w-3/4" />
            <Skeleton className="mb-1 h-4 w-full" />
            <Skeleton className="mb-4 h-4 w-2/3" />
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
