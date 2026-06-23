"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Sparkles } from "lucide-react";
import type { Place } from "@/lib/types";
import { cn, formatDistance, priceLabel } from "@/lib/utils";
import { RatingStars } from "./rating-stars";

export function PlaceCard({
  place,
  index = 0,
  aiReason,
  onSelect,
}: {
  place: Place;
  index?: number;
  aiReason?: string;
  onSelect: (p: Place) => void;
}) {
  const price = priceLabel(place.priceLevel);
  const dist = formatDistance(place.distanceMeters);

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(place)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.4 }}
      whileHover={{ y: -4 }}
      className={cn(
        "glass group flex flex-col overflow-hidden rounded-2xl text-left transition-shadow hover:shadow-xl",
        aiReason && "ring-2 ring-brand/60",
      )}
    >
      <div className="relative h-40 w-full overflow-hidden bg-surface-2">
        {place.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={place.photoUrl}
            alt={place.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-3xl">📍</div>
        )}

        {aiReason && (
          <span className="brand-gradient absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-lg">
            <Sparkles className="h-3 w-3" /> AI Pick
          </span>
        )}
        {place.openNow != null && (
          <span
            className={cn(
              "absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur",
              place.openNow
                ? "bg-emerald-500/85 text-white"
                : "bg-black/55 text-white",
            )}
          >
            <Clock className="h-3 w-3" />
            {place.openNow ? "Open" : "Closed"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{place.name}</h3>
          {price && (
            <span className="shrink-0 rounded-md bg-surface-2 px-1.5 py-0.5 text-xs font-bold text-accent">
              {price}
            </span>
          )}
        </div>

        <RatingStars rating={place.rating} count={place.reviewCount} />

        {aiReason ? (
          <p className="line-clamp-2 text-sm text-brand-2">
            <span className="font-semibold">Why: </span>
            {aiReason}
          </p>
        ) : (
          place.summary && (
            <p className="line-clamp-2 text-sm text-muted">{place.summary}</p>
          )
        )}

        <div className="mt-auto flex items-center gap-3 pt-1 text-xs text-muted">
          {place.address && (
            <span className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{place.address}</span>
            </span>
          )}
          {dist && <span className="shrink-0 font-medium">{dist}</span>}
        </div>
      </div>
    </motion.button>
  );
}
