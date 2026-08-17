import { cache } from "react";
import { categoryMap, type CategorySlug, type Post } from "@/data/posts";

export const WORDPRESS_REVALIDATE_SECONDS = 120;
// Categories change far less often than posts, so they can be cached longer
// to avoid re-hitting WordPress on every related-posts lookup.
const CATEGORY_REVALIDATE_SECONDS = 1800;

type Rendered = { rendered: string };
type WPTerm = { id: number; name: string; slug: string; taxonomy: "category" | "post_tag" };
type WPMedia = { source_url?: string; alt_text?: string };
type WPAuthor = { name?: string };

type WPPost = {
  id: number;
  slug: string;
  status: string;
  date?: string;
  modified?: string;
  title?: Rendered;
  excerpt?: Rendered;
  content?: Rendered;
  categories?: number[];
  tags?: number[];
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPTerm[][];
    author?: WPAuthor[];
  };
};

type WPCategory = { id: number; name: string; slug: string; count: number };

export type PaginatedPosts = {
  posts: Post[];
  total: number;
  totalPages: number;
};

function getWordPressUrl() {
  const value = process.env.WORDPRESS_URL ?? process.env.NEXT_PUBLIC_WORDPRESS_URL;
  if (!value) throw new Error("WORDPRESS_URL is not configured");
  return value.replace(/\/$/, "");
}

async function request<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  revalidateSeconds: number = WORDPRESS_REVALIDATE_SECONDS,
) {
  const url = new URL(`/wp-json/wp/v2/${path}`, getWordPressUrl());
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
    next: { revalidate: revalidateSeconds, tags: ["wordpress"] },
  });
  if (!response.ok) throw new Error(`WordPress request failed: ${response.status}`);
  return { data: (await response.json()) as T, headers: response.headers };
}

function decodeEntities(value: string) {
  const named: Record<string, string> = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
    hellip: "…", ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”",
  };
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] === "#") {
      const hex = code[1]?.toLowerCase() === "x";
      const point = Number.parseInt(code.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
    }
    return named[code.toLowerCase()] ?? entity;
  });
}

function plainText(html: string) {
  return decodeEntities(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function normalizeTitle(value: string) {
  return plainText(value).replace(/^#{1,6}\s*/, "").trim();
}

function embeddedTerms(post: WPPost) {
  return post._embedded?.["wp:term"]?.flat() ?? [];
}

function toPost(post: WPPost): Post {
  const terms = embeddedTerms(post);
  const wpCategorySlug = terms.find((term) => term.taxonomy === "category")?.slug;
  const category = (Object.entries(categoryMap).find(([, slug]) => slug === wpCategorySlug)?.[0] ?? "ff") as CategorySlug;
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  return {
    id: post.id,
    slug: post.slug,
    title: normalizeTitle(post.title?.rendered ?? ""),
    excerpt: plainText(post.excerpt?.rendered ?? ""),
    content: post.content?.rendered ?? "",
    category,
    featuredImage: media?.source_url ?? null,
    featuredImageAlt: plainText(media?.alt_text ?? ""),
    publishedAt: post.date?.slice(0, 10) ?? "",
    modifiedAt: post.modified?.slice(0, 10) ?? "",
    tags: terms.filter((term) => term.taxonomy === "post_tag").map((term) => plainText(term.name)),
    author: plainText(post._embedded?.author?.[0]?.name ?? "컴119"),
  };
}

export async function getCategories() {
  const { data } = await request<WPCategory[]>(
    "categories",
    { per_page: 100, hide_empty: "false" },
    CATEGORY_REVALIDATE_SECONDS,
  );
  return data;
}

const getCategoryId = cache(async (siteCategory: CategorySlug) => {
  const wpSlug = categoryMap[siteCategory];
  const { data } = await request<WPCategory[]>(
    "categories",
    { slug: wpSlug, per_page: 1 },
    CATEGORY_REVALIDATE_SECONDS,
  );
  return data[0]?.id ?? null;
});

export async function getPosts(options: {
  page?: number;
  perPage?: number;
  category?: CategorySlug;
  search?: string;
  exclude?: number;
} = {}): Promise<PaginatedPosts> {
  const categoryId = options.category ? await getCategoryId(options.category) : undefined;
  if (options.category && !categoryId) return { posts: [], total: 0, totalPages: 0 };
  const { data, headers } = await request<WPPost[]>("posts", {
    status: "publish",
    _embed: 1,
    orderby: "date",
    order: "desc",
    page: options.page ?? 1,
    per_page: options.perPage ?? 8,
    categories: categoryId ?? undefined,
    search: options.search,
    exclude: options.exclude,
  });
  return {
    posts: data.map(toPost),
    total: Number(headers.get("x-wp-total") ?? data.length),
    totalPages: Number(headers.get("x-wp-totalpages") ?? 1),
  };
}

export async function getLatestPosts(limit = 8) {
  return (await getPosts({ perPage: limit })).posts;
}

export async function getPostsByCategory(category: CategorySlug, page = 1, perPage = 8, search?: string) {
  return getPosts({ category, page, perPage, search });
}

// Wrapped in React's cache() for request memoization: generateMetadata() and
// the page component both need the same post, and this ensures WordPress is
// only queried once per incoming request instead of twice.
export const getPostBySlug = cache(async (slug: string) => {
  const { data } = await request<WPPost[]>("posts", {
    slug,
    status: "publish",
    _embed: 1,
    per_page: 1,
  });
  return data[0] ? toPost(data[0]) : null;
});

export async function getRelatedPosts(post: Post, limit = 3) {
  const sameCategory = await getPosts({ category: post.category, perPage: limit, exclude: post.id });
  if (sameCategory.posts.length >= limit) return sameCategory.posts.slice(0, limit);
  const latest = await getPosts({ perPage: limit + 1, exclude: post.id });
  const combined = [...sameCategory.posts, ...latest.posts.filter((item) => !sameCategory.posts.some((same) => same.id === item.id))];
  return combined.slice(0, limit);
}
