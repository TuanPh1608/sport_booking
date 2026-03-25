import { Skeleton } from "@/components/ui/skeleton";

export function RouteLoading() {
  return (
    <div className="mx-auto flex min-h-[40vh] w-full max-w-7xl flex-col gap-4 px-4 py-10">
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
      <Skeleton className="h-52 w-full rounded-xl" />
    </div>
  );
}
