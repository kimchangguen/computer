import { NextRequest, NextResponse } from "next/server";
import { categories, type CategorySlug } from "@/data/posts";
import { getPostsByCategory } from "@/lib/wordpress";

// Backs pagination/search on the category pages (app/[category]/page.tsx).
// Kept separate from the page itself so the page's initial render never has
// to read searchParams, letting it stay static/ISR (see CategoryListing.tsx).
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  if (!category || !(category in categories)) {
    return NextResponse.json({ error: "invalid category" }, { status: 400 });
  }

  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const q = searchParams.get("q") ?? undefined;

  const result = await getPostsByCategory(category as CategorySlug, page, 10, q).catch(
    () => ({ posts: [], total: 0, totalPages: 0 }),
  );
  return NextResponse.json(result);
}
