import { NextResponse } from "next/server";
import { hasPlacesKey, searchPlaces } from "@/lib/google";
import { mockPlaces } from "@/lib/mock";
import { distanceBetween } from "@/lib/utils";
import type { Category, Place } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = (searchParams.get("category") || "restaurant") as Category;
  const query = searchParams.get("q") || undefined;
  const lat = searchParams.get("lat")
    ? Number(searchParams.get("lat"))
    : undefined;
  const lng = searchParams.get("lng")
    ? Number(searchParams.get("lng"))
    : undefined;

  let places: Place[];
  let usedMock = false;

  if (hasPlacesKey()) {
    try {
      places = await searchPlaces({ category, query, lat, lng });
      if (places.length === 0) {
        places = mockPlaces(category, lat && lng ? { lat, lng } : undefined);
        usedMock = true;
      }
    } catch (e) {
      console.error("Places search error:", e);
      places = mockPlaces(category, lat && lng ? { lat, lng } : undefined);
      usedMock = true;
    }
  } else {
    places = mockPlaces(category, lat && lng ? { lat, lng } : undefined);
    usedMock = true;
  }

  // Attach distance and sort by a rating + popularity score.
  if (lat != null && lng != null) {
    for (const p of places) {
      p.distanceMeters = distanceBetween({ lat, lng }, p.location);
    }
  }
  places.sort(
    (a, b) =>
      (b.rating ?? 0) * Math.log10((b.reviewCount ?? 0) + 10) -
      (a.rating ?? 0) * Math.log10((a.reviewCount ?? 0) + 10),
  );

  return NextResponse.json({ places, usedMock });
}
