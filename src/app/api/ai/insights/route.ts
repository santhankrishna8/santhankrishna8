import { NextResponse } from "next/server";
import { summarizeReviews, whatToEat } from "@/lib/openai";
import type { Category, Review } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name: string;
      category: Category;
      reviews: Review[];
    };
    const [summary, dishes] = await Promise.all([
      summarizeReviews(body.name, body.reviews ?? []),
      body.category === "restaurant"
        ? whatToEat(body.name, body.reviews ?? [])
        : Promise.resolve<string[]>([]),
    ]);
    return NextResponse.json({ summary, dishes });
  } catch (e) {
    console.error("AI insights error:", e);
    return NextResponse.json({ summary: "", dishes: [] }, { status: 200 });
  }
}
