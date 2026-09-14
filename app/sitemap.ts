import type { MetadataRoute } from "next";
import { categories, type CategorySlug, type Post } from "@/data/posts";
import { getAllPosts } from "@/lib/wordpress";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

// Real "last changed" date for a set of posts, derived from their own
// published/modified timestamps rather than the moment the sitemap happens
// to regenerate. Returns undefined when there's nothing to derive it from —
// Google's own guidance is to omit <lastmod> rather than guess, since a
// wrong (or always-"now") lastmod trains crawlers to stop trusting it.
function latestContentDate(posts: Post[]): Date | undefined {
  const timestamps = posts
    .map((post) => post.modifiedAt || post.publishedAt)
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value).getTime());
  if (timestamps.length === 0) return undefined;
  return new Date(Math.max(...timestamps));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts().catch(() => []);
  const siteLastModified = latestContentDate(posts);

  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: siteLastModified, changeFrequency: "daily", priority: 1 },
    ...Object.keys(categories).map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified: latestContentDate(posts.filter((post) => post.category === (slug as CategorySlug))),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    // /gg (회사소개) is hardcoded, static markup with no content-dated
    // source to derive a real lastmod from — omitted rather than guessed.
    { url: `${SITE_URL}/gg`, changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.modifiedAt ? new Date(post.modifiedAt) : post.publishedAt ? new Date(post.publishedAt) : undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries];
}
