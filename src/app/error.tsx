"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md pt-20 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">
        This page hit an unexpected error. It&apos;s probably transient — try again.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition-all active:scale-[0.97]"
      >
        Try again
      </button>
    </div>
  );
}
