export type Category = "restaurant" | "hotel" | "school";

export interface CategoryMeta {
  id: Category;
  label: string;
  /** Plural noun used in copy. */
  plural: string;
  /** Google Places "includedType" used for Nearby Search. */
  placeType: string;
  emoji: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "restaurant",
    label: "Restaurants",
    plural: "restaurants",
    placeType: "restaurant",
    emoji: "🍽️",
  },
  {
    id: "hotel",
    label: "Hotels",
    plural: "hotels",
    placeType: "lodging",
    emoji: "🏨",
  },
  {
    id: "school",
    label: "Schools",
    plural: "schools",
    placeType: "school",
    emoji: "🎓",
  },
];

export interface Place {
  id: string;
  name: string;
  address?: string;
  rating?: number;
  reviewCount?: number;
  priceLevel?: number | string | null;
  openNow?: boolean | null;
  location: { lat: number; lng: number };
  /** Same-origin photo URL (proxied) or absolute URL for mock data. */
  photoUrl?: string;
  types?: string[];
  summary?: string;
  distanceMeters?: number;
}

export interface Review {
  author?: string;
  rating?: number;
  text?: string;
  relativeTime?: string;
}

export interface PlaceDetail extends Place {
  reviews: Review[];
  phone?: string;
  website?: string;
}

/** A ranked AI recommendation tied to a place in the current list. */
export interface AiPick {
  placeId: string;
  reason: string;
}

export interface AiSuggestResponse {
  answer: string;
  picks: AiPick[];
  tip?: string;
}
