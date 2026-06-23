import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  count,
  size = 14,
  className,
}: {
  rating?: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  if (rating == null) {
    return <span className="text-xs text-muted">No ratings yet</span>;
  }
  const full = Math.round(rating);
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={
              i < full
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-muted/40"
            }
          />
        ))}
      </div>
      <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
      {count != null && (
        <span className="text-xs text-muted">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
