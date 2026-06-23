"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Info, MapIcon, SlidersHorizontal } from "lucide-react";
import { Header } from "@/components/header";
import { CategoryTabs } from "@/components/category-tabs";
import { SearchBar } from "@/components/search-bar";
import { PlaceCard } from "@/components/place-card";
import { MapView } from "@/components/map-view";
import { PlaceDetailSheet } from "@/components/place-detail-sheet";
import { AiAssistant } from "@/components/ai-assistant";
import { ListSkeleton } from "@/components/skeletons";
import { CATEGORIES, type AiPick, type Category, type Place } from "@/lib/types";

const DEFAULT_CENTER = { lat: 40.7484, lng: -73.9857 }; // Manhattan

type SortKey = "best" | "rating" | "distance";

export default function Home() {
  const [category, setCategory] = useState<Category>("restaurant");
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [usedMock, setUsedMock] = useState(false);
  const [selected, setSelected] = useState<Place | null>(null);
  const [picks, setPicks] = useState<AiPick[]>([]);
  const [locating, setLocating] = useState(false);
  const [sort, setSort] = useState<SortKey>("best");
  const [openOnly, setOpenOnly] = useState(false);
  const { resolvedTheme } = useTheme();

  const loadPlaces = useCallback(
    async (cat: Category, c: { lat: number; lng: number }, q?: string) => {
      setLoading(true);
      setPicks([]);
      try {
        const params = new URLSearchParams({
          category: cat,
          lat: String(c.lat),
          lng: String(c.lng),
        });
        if (q) params.set("q", q);
        const res = await fetch(`/api/places/nearby?${params}`);
        const data = await res.json();
        setPlaces(data.places ?? []);
        setUsedMock(Boolean(data.usedMock));
        // Recenter to the strongest result when searching by text.
        if (q && data.places?.[0]) setCenter(data.places[0].location);
      } catch {
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    // Initial load + reload when the category changes (center changes are explicit).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPlaces(category, center);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  function handleLocate() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(c);
        setLocating(false);
        loadPlaces(category, c);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  const meta = CATEGORIES.find((c) => c.id === category)!;
  const pickMap = new Map(picks.map((p) => [p.placeId, p.reason]));

  const visible = places
    .filter((p) => (openOnly ? p.openNow !== false : true))
    .sort((a, b) => {
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === "distance")
        return (a.distanceMeters ?? 1e12) - (b.distanceMeters ?? 1e12);
      return 0; // "best" keeps server ranking
    });

  return (
    <div className="flex min-h-screen flex-col pb-10">
      <Header />

      {/* Hero */}
      <section className="px-4 pt-10 sm:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl"
          >
            Find the best <span className="gradient-text">{meta.plural}</span>
            <br className="hidden sm:block" /> around you
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mx-auto mt-3 max-w-xl text-pretty text-muted"
          >
            Ranked by real ratings and reviews, with AI that tells you exactly
            where to go — and what to order.
          </motion.p>

          <div className="mx-auto mt-7 max-w-xl">
            <SearchBar
              onSearch={(q) => loadPlaces(category, center, q || undefined)}
              onLocate={handleLocate}
              locating={locating}
              placeholder={`Search ${meta.plural} or a city…`}
            />
          </div>

          <div className="mt-5 flex justify-center">
            <CategoryTabs value={category} onChange={setCategory} />
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto mt-8 w-full max-w-6xl px-4">
        {usedMock && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
            <Info className="h-4 w-4 shrink-0" />
            Showing realistic sample data. Add your Google Places &amp; OpenAI
            keys to see live results.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left: assistant + list */}
          <div className="lg:col-span-3">
            <AiAssistant
              category={category}
              places={places}
              onPicks={setPicks}
            />

            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">
                {loading ? "Finding great spots…" : `${visible.length} results`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOpenOnly((v) => !v)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    openOnly
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  Open now
                </button>
                <div className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="cursor-pointer bg-transparent font-medium outline-none"
                    aria-label="Sort results"
                  >
                    <option value="best">Best match</option>
                    <option value="rating">Top rated</option>
                    <option value="distance">Nearest</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4">
              {loading ? (
                <ListSkeleton />
              ) : visible.length ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {visible.map((p, i) => (
                    <PlaceCard
                      key={p.id}
                      place={p}
                      index={i}
                      aiReason={pickMap.get(p.id)}
                      onSelect={setSelected}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass grid place-items-center rounded-2xl p-10 text-center">
                  <MapIcon className="mb-2 h-8 w-8 text-muted" />
                  <p className="font-semibold">No results here</p>
                  <p className="text-sm text-muted">
                    Try another area or category.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: sticky map */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 h-[60vh] min-h-[420px] lg:h-[calc(100vh-7rem)]">
              <MapView
                places={visible}
                center={center}
                selectedId={selected?.id}
                onSelect={setSelected}
                darkHint={resolvedTheme === "dark"}
              />
            </div>
          </div>
        </div>
      </section>

      <PlaceDetailSheet
        place={selected}
        category={category}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
