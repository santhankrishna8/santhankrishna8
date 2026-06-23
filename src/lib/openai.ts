import OpenAI from "openai";
import type { AiSuggestResponse, Category, Place, Review } from "./types";

export function hasOpenAiKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function client() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function placeLines(places: Place[]) {
  return places
    .slice(0, 12)
    .map(
      (p, i) =>
        `${i + 1}. id=${p.id} | ${p.name} | rating ${p.rating ?? "?"} (${
          p.reviewCount ?? 0
        } reviews)${p.priceLevel ? ` | price ${p.priceLevel}` : ""}${
          p.openNow ? " | open now" : ""
        }${p.summary ? ` | ${p.summary}` : ""}`,
    )
    .join("\n");
}

/** Smart, ratings-based fallback used when no OpenAI key is set. */
function heuristicSuggest(
  category: Category,
  places: Place[],
  message?: string,
): AiSuggestResponse {
  const ranked = [...places].sort(
    (a, b) =>
      (b.rating ?? 0) * Math.log10((b.reviewCount ?? 0) + 10) -
      (a.rating ?? 0) * Math.log10((a.reviewCount ?? 0) + 10),
  );
  const picks = ranked.slice(0, 3).map((p) => ({
    placeId: p.id,
    reason: `Rated ${p.rating ?? "highly"}★ across ${
      p.reviewCount ?? "many"
    } reviews${p.summary ? ` — ${p.summary}` : ""}.`,
  }));
  const top = ranked[0];
  const answer = top
    ? `Based on ratings and review volume, my top ${category} pick is ${top.name}. ${
        message ? "Here are the standouts for what you asked:" : "Here are the best options nearby:"
      }`
    : "I couldn't find any places to rank yet — try searching a different area.";
  return {
    answer,
    picks,
    tip: "Tip: places with both a high rating and many reviews are the safest bets.",
  };
}

export async function suggestPlaces(opts: {
  category: Category;
  places: Place[];
  message?: string;
}): Promise<AiSuggestResponse> {
  const { category, places, message } = opts;
  if (!hasOpenAiKey() || places.length === 0) {
    return heuristicSuggest(category, places, message);
  }

  const sys =
    "You are Spotlight, a concise, friendly local-recommendations concierge. " +
    "You ONLY recommend from the provided list of places and you MUST reference them by their exact id. " +
    "Weigh both rating and number of reviews. Reply in JSON with this shape: " +
    '{"answer": string, "picks": [{"placeId": string, "reason": string}], "tip": string}. ' +
    "Keep `answer` to 1-2 warm sentences, give 3 picks max, each reason one short sentence.";

  const user = `Category: ${category}
User request: ${message || "Recommend the best options."}
Places:
${placeLines(places)}`;

  try {
    const res = await client().chat.completions.create({
      model: MODEL,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
    });
    const raw = res.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as AiSuggestResponse;
    // Drop any hallucinated ids that aren't in our list.
    const valid = new Set(places.map((p) => p.id));
    parsed.picks = (parsed.picks ?? []).filter((p) => valid.has(p.placeId));
    if (!parsed.picks.length) return heuristicSuggest(category, places, message);
    return parsed;
  } catch {
    return heuristicSuggest(category, places, message);
  }
}

export async function summarizeReviews(
  name: string,
  reviews: Review[],
): Promise<string> {
  const text = reviews
    .map((r) => `(${r.rating ?? "?"}★) ${r.text ?? ""}`)
    .filter(Boolean)
    .join("\n");

  if (!hasOpenAiKey() || !text) {
    return reviews.length
      ? "Visitors consistently praise the experience, service, and value — a reliably well-reviewed spot."
      : "No reviews available yet.";
  }
  try {
    const res = await client().chat.completions.create({
      model: MODEL,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "Summarize these reviews in 2 short sentences capturing what people love and any caveats. Be specific and warm.",
        },
        { role: "user", content: `Place: ${name}\nReviews:\n${text}` },
      ],
    });
    return res.choices[0]?.message?.content?.trim() || "";
  } catch {
    return "Visitors consistently praise the experience and service.";
  }
}

export async function whatToEat(
  name: string,
  reviews: Review[],
): Promise<string[]> {
  const fallback = [
    "Chef's signature dish",
    "Most-ordered house special",
    "A shareable starter for the table",
  ];
  if (!hasOpenAiKey()) return fallback;
  try {
    const ctx = reviews.map((r) => r.text).filter(Boolean).join("\n");
    const res = await client().chat.completions.create({
      model: MODEL,
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'Suggest 3 specific dishes a first-timer should order. Reply JSON: {"dishes": string[]}. If unsure, suggest popular dishes for this type of place.',
        },
        {
          role: "user",
          content: `Restaurant: ${name}\nReview hints:\n${ctx || "(none)"}`,
        },
      ],
    });
    const parsed = JSON.parse(res.choices[0]?.message?.content ?? "{}") as {
      dishes?: string[];
    };
    return parsed.dishes?.length ? parsed.dishes.slice(0, 3) : fallback;
  } catch {
    return fallback;
  }
}
