import type { Category, Place, PlaceDetail, Review } from "./types";
import { CATEGORIES } from "./types";

const PLACES_BASE = "https://places.googleapis.com/v1";

export function hasPlacesKey() {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY);
}

function placeType(category: Category) {
  return CATEGORIES.find((c) => c.id === category)?.placeType ?? "restaurant";
}

/** Build a same-origin proxied photo URL (keeps the API key server-side). */
function photoProxyUrl(photoName?: string) {
  if (!photoName) return undefined;
  return `/api/places/photo?name=${encodeURIComponent(photoName)}`;
}

interface GooglePlace {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  location?: { latitude: number; longitude: number };
  photos?: { name: string }[];
  currentOpeningHours?: { openNow?: boolean };
  types?: string[];
  editorialSummary?: { text: string };
}

function normalize(p: GooglePlace): Place {
  return {
    id: p.id,
    name: p.displayName?.text ?? "Unknown",
    address: p.formattedAddress,
    rating: p.rating,
    reviewCount: p.userRatingCount,
    priceLevel: p.priceLevel ?? null,
    openNow: p.currentOpeningHours?.openNow ?? null,
    location: {
      lat: p.location?.latitude ?? 0,
      lng: p.location?.longitude ?? 0,
    },
    photoUrl: photoProxyUrl(p.photos?.[0]?.name),
    types: p.types,
    summary: p.editorialSummary?.text,
  };
}

const SEARCH_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.location",
  "places.photos",
  "places.currentOpeningHours.openNow",
  "places.types",
  "places.editorialSummary",
].join(",");

export async function searchPlaces(opts: {
  category: Category;
  query?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}): Promise<Place[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY!;
  const { category, query, lat, lng, radius = 4000 } = opts;

  // Text Search when there's a query; otherwise Nearby Search around a point.
  const useText = Boolean(query && query.trim());
  const url = useText
    ? `${PLACES_BASE}/places:searchText`
    : `${PLACES_BASE}/places:searchNearby`;

  const body: Record<string, unknown> = useText
    ? {
        textQuery: `${query} ${category}`,
        includedType: placeType(category),
        maxResultCount: 16,
        ...(lat != null && lng != null
          ? {
              locationBias: {
                circle: { center: { latitude: lat, longitude: lng }, radius },
              },
            }
          : {}),
      }
    : {
        includedTypes: [placeType(category)],
        maxResultCount: 16,
        rankPreference: "POPULARITY",
        locationRestriction: {
          circle: {
            center: { latitude: lat ?? 40.7484, longitude: lng ?? -73.9857 },
            radius,
          },
        },
      };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": SEARCH_FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Places search failed (${res.status}): ${detail}`);
  }

  const data = (await res.json()) as { places?: GooglePlace[] };
  return (data.places ?? []).map(normalize);
}

const DETAIL_FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "rating",
  "userRatingCount",
  "priceLevel",
  "location",
  "photos",
  "currentOpeningHours.openNow",
  "types",
  "editorialSummary",
  "reviews",
  "internationalPhoneNumber",
  "websiteUri",
].join(",");

interface GoogleReview {
  authorAttribution?: { displayName?: string };
  rating?: number;
  text?: { text?: string };
  relativePublishTimeDescription?: string;
}

export async function getPlaceDetail(placeId: string): Promise<PlaceDetail> {
  const key = process.env.GOOGLE_PLACES_API_KEY!;
  const res = await fetch(`${PLACES_BASE}/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": DETAIL_FIELD_MASK,
    },
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Place details failed (${res.status}): ${detail}`);
  }
  const p = (await res.json()) as GooglePlace & {
    reviews?: GoogleReview[];
    internationalPhoneNumber?: string;
    websiteUri?: string;
  };
  const base = normalize(p);
  const reviews: Review[] = (p.reviews ?? []).slice(0, 6).map((r) => ({
    author: r.authorAttribution?.displayName,
    rating: r.rating,
    text: r.text?.text,
    relativeTime: r.relativePublishTimeDescription,
  }));
  return {
    ...base,
    reviews,
    phone: p.internationalPhoneNumber,
    website: p.websiteUri,
  };
}

/** Fetch raw photo bytes for the proxy route. Returns the upstream Response. */
export async function fetchPhoto(name: string, maxWidth = 800) {
  const key = process.env.GOOGLE_PLACES_API_KEY!;
  const url = `${PLACES_BASE}/${name}/media?maxWidthPx=${maxWidth}&key=${key}`;
  return fetch(url, { redirect: "follow" });
}
