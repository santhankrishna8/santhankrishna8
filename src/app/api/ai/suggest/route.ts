import { NextResponse } from "next/server";
import { suggestPlaces } from "@/lib/openai";
import type { Category, Place } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      category: Category;
      message?: string;
      places: Place[];
    };
    const result = await suggestPlaces({
      category: body.category,
      message: body.message,
      places: body.places ?? [],
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error("AI suggest error:", e);
    return NextResponse.json(
      { answer: "Sorry, I couldn't generate suggestions right now.", picks: [] },
      { status: 200 },
    );
  }
}
