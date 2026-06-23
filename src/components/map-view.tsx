"use client";

import {
  AdvancedMarker,
  APIProvider,
  Map as GoogleMap,
} from "@vis.gl/react-google-maps";
import { MapPin, Star } from "lucide-react";
import type { Place } from "@/lib/types";
import { cn } from "@/lib/utils";

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function MapView({
  places,
  center,
  selectedId,
  onSelect,
  darkHint,
}: {
  places: Place[];
  center: { lat: number; lng: number };
  selectedId?: string;
  onSelect: (p: Place) => void;
  darkHint?: boolean;
}) {
  if (!KEY) {
    return (
      <div className="glass relative grid h-full w-full place-items-center overflow-hidden rounded-3xl">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-xs text-center">
          <MapPin className="mx-auto mb-2 h-8 w-8 text-brand" />
          <p className="font-semibold">Live map ready</p>
          <p className="mt-1 text-sm text-muted">
            Add{" "}
            <code className="rounded bg-surface-2 px-1">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            </code>{" "}
            to show the interactive Google Map. The list is fully functional
            now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden rounded-3xl">
      <APIProvider apiKey={KEY}>
        <GoogleMap
          key={`${center.lat.toFixed(3)},${center.lng.toFixed(3)}`}
          mapId="DEMO_MAP_ID"
          defaultCenter={center}
          defaultZoom={14}
          gestureHandling="greedy"
          disableDefaultUI
          colorScheme={darkHint ? "DARK" : "LIGHT"}
          className="h-full w-full"
        >
          {places.map((p) => {
            const active = p.id === selectedId;
            return (
              <AdvancedMarker
                key={p.id}
                position={p.location}
                onClick={() => onSelect(p)}
                zIndex={active ? 99 : 1}
              >
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold shadow-lg transition-transform",
                    active
                      ? "scale-110 border-transparent text-white"
                      : "border-border bg-surface text-foreground hover:scale-105",
                  )}
                  style={
                    active
                      ? {
                          background:
                            "linear-gradient(120deg, var(--brand), var(--brand-2))",
                        }
                      : undefined
                  }
                >
                  <Star
                    className={cn(
                      "h-3 w-3",
                      active ? "fill-white text-white" : "fill-amber-400 text-amber-400",
                    )}
                  />
                  {p.rating?.toFixed(1) ?? "•"}
                </div>
              </AdvancedMarker>
            );
          })}
        </GoogleMap>
      </APIProvider>
    </div>
  );
}
