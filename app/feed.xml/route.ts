import { getLatestPosts } from "@/lib/wordpress";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

// Matches the sitemap's freshness window — a new post shows up here within
// the same hour it shows up in sitemap.xml.
export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getLatestPosts(20).catch(() => []);

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);
      const pubDate = post.publishedAtISO ? new Date(post.publishedAtISO).toUTCString() : undefined;
      return `<item>
<title>${escapeXml(post.title)}</title>
<link>${escapeXml(url)}</link>
<guid isPermaLink="true">${escapeXml(url)}</guid>
${pubDate ? `<pubDate>${pubDate}</pubDate>\n` : ""}<description>${escapeXml(post.excerpt)}</description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${escapeXml(SITE_NAME)}</title>
<link>${SITE_URL}</link>
<description>${escapeXml(SITE_NAME)} 컴퓨터 수리 전문 정보 블로그</description>
<language>ko-KR</language>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
