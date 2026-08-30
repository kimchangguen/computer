"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PostGrid } from "@/components/PostCard";
import type { CategorySlug } from "@/data/posts";
import type { PaginatedPosts } from "@/lib/wordpress";

type Props = {
  category: CategorySlug;
  categoryName: string;
  icon: string;
  initial: PaginatedPosts;
};

// Reads page/q from useSearchParams instead of the page's searchParams prop,
// so app/[category]/page.tsx never touches searchParams and can stay
// static/ISR. Page 1 with no query renders the server-fetched `initial` data
// with no extra request; any other page/search fetches from /api/posts.
export function CategoryListing({ category, categoryName, icon, initial }: Props) {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const q = searchParams.get("q") ?? undefined;
  const isDefaultView = page === 1 && !q;
  const viewKey = `${category}:${page}:${q ?? ""}`;

  // Fetched result is keyed so a stale response from a superseded navigation
  // can never render, and reverting to the default view needs no fetch at
  // all — `result`/`loading` below just derive from `initial` directly.
  const [fetched, setFetched] = useState<{ key: string; data: PaginatedPosts } | null>(null);

  useEffect(() => {
    if (isDefaultView) return;
    let cancelled = false;
    const url = `/api/posts?category=${category}&page=${page}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
    fetch(url)
      .then((response) => response.json())
      .then((data: PaginatedPosts) => {
        if (!cancelled) setFetched({ key: viewKey, data });
      })
      .catch(() => {
        if (!cancelled) setFetched({ key: viewKey, data: { posts: [], total: 0, totalPages: 0 } });
      });
    return () => {
      cancelled = true;
    };
  }, [category, page, q, isDefaultView, viewKey]);

  const hasFreshData = isDefaultView || fetched?.key === viewKey;
  const result = isDefaultView ? initial : fetched?.key === viewKey ? fetched.data : initial;
  const loading = !hasFreshData;

  return (
    <ListingBody
      category={category}
      categoryName={categoryName}
      icon={icon}
      result={result}
      page={page}
      query={q}
      loading={loading}
    />
  );
}

// Pure presentational half, reused as the Suspense fallback (page 1, no
// query, loading=false) so the statically-rendered shell and the hydrated
// client view are pixel-identical.
export function ListingBody({
  category,
  categoryName,
  icon,
  result,
  page,
  query,
  loading,
}: {
  category: CategorySlug;
  categoryName: string;
  icon: string;
  result: PaginatedPosts;
  page: number;
  query?: string;
  loading?: boolean;
}) {
  const featured = page === 1 ? result.posts[0] : undefined;
  const gridPosts = featured ? result.posts.slice(1) : result.posts;

  return (
    <>
      {featured && (
        <section className="featured-post">
          <Link href={`/blog/${featured.slug}`} className="shell featured-grid">
            <div className="featured-image tone-display">
              {featured.featuredImage ? (
                <img src={featured.featuredImage} alt={featured.featuredImageAlt || featured.title} />
              ) : (
                <span>{icon}</span>
              )}
            </div>
            <div className="featured-body">
              <span className="category-label">{categoryName}</span>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <time>{featured.publishedAt.replaceAll("-", ".")}</time>
            </div>
          </Link>
        </section>
      )}
      {(gridPosts.length > 0 || result.total === 0) && (
        <section className="section listing" aria-busy={loading || undefined}>
          <div className="shell">
            <div className="listing-head">
              <h2>최신 포스팅</h2>
              <span>총 {result.total}개의 콘텐츠</span>
            </div>
            <PostGrid posts={gridPosts} />
            <Pagination category={category} page={page} totalPages={result.totalPages} query={query} />
          </div>
        </section>
      )}
    </>
  );
}

function Pagination({
  category,
  page,
  totalPages,
  query,
}: {
  category: string;
  page: number;
  totalPages: number;
  query?: string;
}) {
  if (totalPages < 1) return null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).slice(Math.max(0, page - 3), page + 2);
  const href = (target: number) => `/${category}?page=${target}${query ? `&q=${encodeURIComponent(query)}` : ""}`;
  return (
    <nav className="pagination" aria-label="페이지 이동">
      {pages.map((target) =>
        target === page ? <b key={target}>{target}</b> : <Link key={target} href={href(target)}>{target}</Link>,
      )}
      {page < totalPages && <Link href={href(page + 1)}>다음 →</Link>}
    </nav>
  );
}
