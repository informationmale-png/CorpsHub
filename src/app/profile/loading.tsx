import Skeleton from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-2xl">
      <Skeleton className="mb-1 h-8 w-48" />
      <Skeleton className="mb-6 h-4 w-80" />
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <Skeleton className="h-18 w-18 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="mb-1 h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <div>
          <Skeleton className="mb-1 h-4 w-12" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
