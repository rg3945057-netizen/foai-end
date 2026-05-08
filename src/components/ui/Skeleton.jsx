import { clsx } from 'clsx';

export function Skeleton({ className = '', ...props }) {
  return <div className={clsx('skeleton', className)} {...props} />;
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="glass-card p-4 md:p-6 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-2 w-1/3" />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={clsx('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}

export function SkeletonNewsCard() {
  return (
    <div className="glass-card overflow-hidden animate-pulse">
      <Skeleton className="w-full h-44" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-7 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonMap() {
  return (
    <div className="glass-card overflow-hidden animate-pulse">
      <Skeleton className="w-full h-80" />
      <div className="p-4 grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-2 w-12" />
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
