import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-md bg-slate-100',
        className
      )}
    />
  );
}

export function JobCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}
