export function PlaceCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-3">
      <div className="shimmer mb-3 h-36 w-full rounded-xl bg-surface-2" />
      <div className="shimmer mb-2 h-4 w-2/3 rounded bg-surface-2" />
      <div className="shimmer mb-2 h-3 w-1/2 rounded bg-surface-2" />
      <div className="shimmer h-3 w-1/3 rounded bg-surface-2" />
    </div>
  );
}

export function ListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <PlaceCardSkeleton key={i} />
      ))}
    </div>
  );
}
