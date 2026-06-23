import { fetchPhoto, hasPlacesKey } from "@/lib/google";

/** Streams a Google Places photo so the API key stays server-side. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  if (!name || !hasPlacesKey()) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const upstream = await fetchPhoto(name);
    if (!upstream.ok || !upstream.body) {
      return new Response("Not found", { status: 404 });
    }
    return new Response(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
