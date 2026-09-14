import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // /api/posts is a JSON endpoint that backs client-side pagination/search
    // (see app/api/posts/route.ts) — it's only ever reached via fetch(), not
    // a crawlable link, and has no content value to index.
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
