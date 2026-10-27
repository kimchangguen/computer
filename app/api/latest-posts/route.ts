import { NextRequest, NextResponse } from "next/server";
import { getPosts } from "@/lib/wordpress";
import { HOME_POSTS_PER_PAGE, parsePageParam } from "@/lib/home-pagination";

// Backs pagination of the home page's "최신 수리 콘텐츠" grid (all
// categories, newest first). Kept separate from app/page.tsx so the home page
// never reads searchParams and stays static/ISR (see HomeLatestPosts.tsx).
// Unlike /api/posts, a WordPress failure is returned as a 502 rather than an
// empty list, so the client can show an error instead of "no posts".
export async function GET(request: NextRequest) {
  const page = parsePageParam(request.nextUrl.searchParams.get("page"));
  try {
    const result = await getPosts({ page, perPage: HOME_POSTS_PER_PAGE });
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("[latest-posts] WordPress request failed", { page, error });
    return NextResponse.json({ error: "wordpress unavailable" }, { status: 502 });
  }
}
