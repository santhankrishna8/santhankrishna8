"use client";

/* This effect synchronizes fetched detail/AI state to the selected place. */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  Globe,
  Loader2,
  Navigation,
  Phone,
  Sparkles,
  UtensilsCrossed,
  X,
} from "lucide-react";
import type { Category, Place, PlaceDetail } from "@/lib/types";
import { priceLabel } from "@/lib/utils";
import { RatingStars } from "./rating-stars";

export function PlaceDetailSheet({
  place,
  category,
  onClose,
}: {
  place: Place | null;
  category: Category;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [dishes, setDishes] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!place) return;
    let active = true;
    setDetail(null);
    setSummary("");
    setDishes([]);
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(
          `/api/places/details?id=${encodeURIComponent(place.id)}`,
        );
        const data = await res.json();
        if (!active) return;
        const d: PlaceDetail = data.detail;
        setDetail(d);
        setLoading(false);

        setAiLoading(true);
        const aiRes = await fetch("/api/ai/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: d.name,
            category,
            reviews: d.reviews,
          }),
        });
        const ai = await aiRes.json();
        if (!active) return;
        setSummary(ai.summary ?? "");
        setDishes(ai.dishes ?? []);
      } catch {
        if (active) setLoading(false);
      } finally {
        if (active) setAiLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [place, category]);

  const mapsUrl = place
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        place.name,
      )}&query_place_id=${place.id}`
    : "#";

  return (
    <AnimatePresence>
      {place && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto bg-surface shadow-2xl sm:max-w-lg"
            role="dialog"
            aria-label={`${place.name} details`}
          >
            <div className="relative h-56 w-full shrink-0 bg-surface-2">
              {place.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={place.photoUrl}
                  alt={place.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-5xl">📍</div>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="glass absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-5 p-5">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-2xl font-bold leading-tight">
                    {place.name}
                  </h2>
                  {priceLabel(place.priceLevel) && (
                    <span className="shrink-0 rounded-md bg-surface-2 px-2 py-1 text-sm font-bold text-accent">
                      {priceLabel(place.priceLevel)}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <RatingStars
                    rating={place.rating}
                    count={place.reviewCount}
                    size={16}
                  />
                </div>
                {place.address && (
                  <p className="mt-2 text-sm text-muted">{place.address}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="brand-gradient flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow"
                >
                  <Navigation className="h-4 w-4" /> Directions
                </a>
                {detail?.website && (
                  <a
                    href={detail.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-4 py-2 text-sm font-semibold"
                  >
                    <Globe className="h-4 w-4" /> Website
                  </a>
                )}
                {detail?.phone && (
                  <a
                    href={`tel:${detail.phone}`}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-4 py-2 text-sm font-semibold"
                  >
                    <Phone className="h-4 w-4" /> Call
                  </a>
                )}
              </div>

              {/* AI insights */}
              <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand" />
                  <h3 className="text-sm font-bold">AI summary</h3>
                </div>
                {aiLoading && !summary ? (
                  <p className="flex items-center gap-2 text-sm text-muted">
                    <Loader2 className="h-4 w-4 animate-spin" /> Reading the
                    reviews…
                  </p>
                ) : (
                  <p className="text-sm leading-relaxed">
                    {summary || "No summary available."}
                  </p>
                )}

                {category === "restaurant" && dishes.length > 0 && (
                  <div className="mt-3 border-t border-brand/20 pt-3">
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-brand">
                      <UtensilsCrossed className="h-3.5 w-3.5" /> What to eat
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {dishes.map((d) => (
                        <span
                          key={d}
                          className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reviews */}
              <div>
                <h3 className="mb-3 text-sm font-bold">What people say</h3>
                {loading ? (
                  <p className="flex items-center gap-2 text-sm text-muted">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading
                    reviews…
                  </p>
                ) : detail?.reviews.length ? (
                  <div className="space-y-3">
                    {detail.reviews.map((r, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-border bg-surface-2 p-3"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-semibold">
                            {r.author ?? "Guest"}
                          </span>
                          <RatingStars rating={r.rating} size={12} />
                        </div>
                        <p className="text-sm text-muted">{r.text}</p>
                        {r.relativeTime && (
                          <p className="mt-1 text-[11px] text-muted/70">
                            {r.relativeTime}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted">No reviews yet.</p>
                )}
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-auto flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-brand hover:underline"
              >
                View on Google Maps <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
