import { NextResponse } from "next/server";
import { getPlaceDetail, hasPlacesKey } from "@/lib/google";
import { mockPlaces, mockReviews } from "@/lib/mock";
import type { Category, PlaceDetail } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // Mock ids look like "mock-r1" / "mock-h2" / "mock-s3".
  const isMock = id.startsWith("mock-") || !hasPlacesKey();
  if (isMock) {
    const cat: Category = id.includes("-h")
      ? "hotel"
      : id.includes("-s")
        ? "school"
        : "restaurant";
    const place = mockPlaces(cat).find((p) => p.id === id) ?? mockPlaces(cat)[0];
    const detail: PlaceDetail = { ...place, reviews: mockReviews() };
    return NextResponse.json({ detail });
  }

  try {
    const detail = await getPlaceDetail(id);
    return NextResponse.json({ detail });
  } catch (e) {
    console.error("Place details error:", e);
    return NextResponse.json(
      { error: "Failed to load place details" },
      { status: 502 },
    );
  }
}
