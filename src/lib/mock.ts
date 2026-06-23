import type { Category, Place, Review } from "./types";

/**
 * Realistic fallback data so the app always looks complete during a demo,
 * even before Google Places / OpenAI keys are configured.
 * Photos use Unsplash (royalty-free).
 */

const RESTAURANTS: Place[] = [
  {
    id: "mock-r1",
    name: "Saffron & Smoke",
    address: "12 Garden Road, Downtown",
    rating: 4.8,
    reviewCount: 2143,
    priceLevel: 3,
    openNow: true,
    location: { lat: 0, lng: 0 },
    photoUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    summary: "Modern Indian small plates and wood-fired grills.",
  },
  {
    id: "mock-r2",
    name: "La Trattoria Verde",
    address: "88 Olive Street",
    rating: 4.7,
    reviewCount: 1567,
    priceLevel: 2,
    openNow: true,
    location: { lat: 0, lng: 0 },
    photoUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    summary: "Handmade pasta and Neapolitan pizza in a cozy room.",
  },
  {
    id: "mock-r3",
    name: "Sakura Sushi House",
    address: "5 Riverside Walk",
    rating: 4.6,
    reviewCount: 980,
    priceLevel: 3,
    openNow: false,
    location: { lat: 0, lng: 0 },
    photoUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
    summary: "Omakase and fresh nigiri from a celebrated chef.",
  },
  {
    id: "mock-r4",
    name: "The Green Bowl",
    address: "200 Market Lane",
    rating: 4.5,
    reviewCount: 742,
    priceLevel: 1,
    openNow: true,
    location: { lat: 0, lng: 0 },
    photoUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    summary: "Fast, healthy grain bowls and cold-pressed juices.",
  },
  {
    id: "mock-r5",
    name: "Ember Steakhouse",
    address: "47 Highline Ave",
    rating: 4.4,
    reviewCount: 1320,
    priceLevel: 4,
    openNow: true,
    location: { lat: 0, lng: 0 },
    photoUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    summary: "Dry-aged steaks and an extensive wine cellar.",
  },
  {
    id: "mock-r6",
    name: "Café Aurora",
    address: "9 Sunrise Blvd",
    rating: 4.3,
    reviewCount: 611,
    priceLevel: 2,
    openNow: true,
    location: { lat: 0, lng: 0 },
    photoUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    summary: "All-day brunch, specialty coffee, and pastries.",
  },
];

const HOTELS: Place[] = [
  {
    id: "mock-h1",
    name: "The Grand Meridian",
    address: "1 Park Plaza",
    rating: 4.9,
    reviewCount: 3421,
    priceLevel: 4,
    openNow: true,
    location: { lat: 0, lng: 0 },
    photoUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    summary: "Five-star rooftop pool, spa, and skyline suites.",
  },
  {
    id: "mock-h2",
    name: "Harbor View Boutique",
    address: "23 Marina Way",
    rating: 4.7,
    reviewCount: 1890,
    priceLevel: 3,
    openNow: true,
    location: { lat: 0, lng: 0 },
    photoUrl:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    summary: "Design-forward rooms steps from the waterfront.",
  },
  {
    id: "mock-h3",
    name: "Cedar & Pine Lodge",
    address: "77 Forest Trail",
    rating: 4.6,
    reviewCount: 1102,
    priceLevel: 2,
    openNow: true,
    location: { lat: 0, lng: 0 },
    photoUrl:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    summary: "Cozy mountain retreat with fireplaces and trails.",
  },
  {
    id: "mock-h4",
    name: "City Center Inn",
    address: "330 Central St",
    rating: 4.4,
    reviewCount: 2540,
    priceLevel: 2,
    openNow: true,
    location: { lat: 0, lng: 0 },
    photoUrl:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    summary: "Reliable comfort in the heart of the action.",
  },
  {
    id: "mock-h5",
    name: "The Velvet Suites",
    address: "14 Opera Square",
    rating: 4.8,
    reviewCount: 980,
    priceLevel: 4,
    openNow: true,
    location: { lat: 0, lng: 0 },
    photoUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    summary: "Opulent suites with personalized concierge service.",
  },
];

const SCHOOLS: Place[] = [
  {
    id: "mock-s1",
    name: "Riverside International School",
    address: "100 Scholars Drive",
    rating: 4.8,
    reviewCount: 412,
    priceLevel: null,
    openNow: true,
    location: { lat: 0, lng: 0 },
    photoUrl:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    summary: "IB curriculum with strong STEM and arts programs.",
  },
  {
    id: "mock-s2",
    name: "Oakwood Academy",
    address: "55 Maple Avenue",
    rating: 4.7,
    reviewCount: 365,
    priceLevel: null,
    openNow: true,
    location: { lat: 0, lng: 0 },
    photoUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    summary: "Small class sizes and a renowned music department.",
  },
  {
    id: "mock-s3",
    name: "Bright Future Primary",
    address: "8 Learning Lane",
    rating: 4.6,
    reviewCount: 289,
    priceLevel: null,
    openNow: true,
    location: { lat: 0, lng: 0 },
    photoUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    summary: "Nurturing early-years education with outdoor learning.",
  },
  {
    id: "mock-s4",
    name: "Summit Science & Tech High",
    address: "240 Innovation Pkwy",
    rating: 4.5,
    reviewCount: 521,
    priceLevel: null,
    openNow: true,
    location: { lat: 0, lng: 0 },
    photoUrl:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    summary: "Top-ranked robotics team and college placement.",
  },
];

const MOCK_REVIEWS: Review[] = [
  {
    author: "Priya S.",
    rating: 5,
    text: "Absolutely loved it. The service was attentive and the ambience is perfect for a special evening.",
    relativeTime: "2 weeks ago",
  },
  {
    author: "Daniel M.",
    rating: 5,
    text: "Easily one of the best in the area. Came back twice in one week — highly recommend.",
    relativeTime: "a month ago",
  },
  {
    author: "Aisha K.",
    rating: 4,
    text: "Great experience overall. Slightly busy on weekends but worth the short wait.",
    relativeTime: "3 weeks ago",
  },
];

export function mockPlaces(
  category: Category,
  center?: { lat: number; lng: number },
): Place[] {
  const base =
    category === "hotel"
      ? HOTELS
      : category === "school"
        ? SCHOOLS
        : RESTAURANTS;

  // Scatter mock pins near the map center so the demo looks geographic.
  const c = center ?? { lat: 40.7484, lng: -73.9857 };
  return base.map((p, i) => {
    const angle = (i / base.length) * Math.PI * 2;
    const r = 0.006 + (i % 3) * 0.004;
    return {
      ...p,
      location: {
        lat: c.lat + Math.sin(angle) * r,
        lng: c.lng + Math.cos(angle) * r,
      },
    };
  });
}

export function mockReviews(): Review[] {
  return MOCK_REVIEWS;
}
