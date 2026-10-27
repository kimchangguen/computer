"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PostGrid } from "@/components/PostCard";
import { getPageWindow, parsePageParam } from "@/lib/home-pagination";
import type { PaginatedPosts } from "@/lib/wordpress";

export const LATEST_SECTION_ID = "latest-content";

type Props = {
  // null means the server-side WordPress fetch failed (not "no posts").
  initial: PaginatedPosts | null;
};

type Fetched = { key: number; data: PaginatedPosts | null };

// Same approach as CategoryListing.tsx: reads ?page= via useSearchParams so
// app/page.tsx never touches searchParams and stays static/ISR. Page 1
// renders the server-fetched `initial` data with no extra request; other
// pages fetch that page from WordPress through /api/latest-posts.
export function HomeLatestPosts({ initial }: Props) {
  const searchParams = useSearchParams();
  const requested = parsePageParam(searchParams.get("page"));
  // Clamp ?page=999 to the real last page instead of asking WordPress for a
  // page that doesn't exist.
  const page = initial && initial.totalPages > 0 ? Math.min(requested, initial.totalPages) : requested;
  const isDefaultView = page === 1;

  const [fetched, setFetched] = useState<Fetched | null>(null);

  useEffect(() => {
    if (isDefaultView) return;
    let cancelled = false;
    fetch(`/api/latest-posts?page=${page}`)
      .then((response) => {
        if (!response.ok) throw new Error(`latest-posts request failed: ${response.status}`);
        return response.json() as Promise<PaginatedPosts>;
      })
      .then((data) => {
        if (!cancelled) setFetched({ key: page, data });
      })
      .catch(() => {
        if (!cancelled) setFetched({ key: page, data: null });
      });
    return () => {
      cancelled = true;
    };
  }, [page, isDefaultView]);

  const isFresh = isDefaultView || fetched?.key === page;
  // While a new page loads, keep showing whatever was on screen last.
  const shown = isDefaultView ? initial : fetched ? fetched.data : initial;
  return <HomeLatestBody result={shown} page={page} loading={!isFresh} />;
}

// Pure presentational half, also used as the Suspense fallback (page 1) so the
// static HTML and the hydrated view are identical.
export function HomeLatestBody({
  result,
  page,
  loading,
}: {
  result: PaginatedPosts | null;
  page: number;
  loading?: boolean;
}) {
  return (
    <div aria-busy={loading || undefined}>
      {result ? (
        <PostGrid posts={result.posts} />
      ) : (
        <div className="post-grid" role="alert">
          <p className="empty-posts">콘텐츠를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>
        </div>
      )}
      {result && <HomePagination page={page} totalPages={result.totalPages} />}
    </div>
  );
}

function scrollToLatest() {
  document.getElementById(LATEST_SECTION_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function HomePagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  const { pages, showGap, showLast } = getPageWindow(page, totalPages);
  const pageLink = (target: number, label: string) => (
    <Link key={label} href={target === 1 ? "/" : `/?page=${target}`} scroll={false} prefetch={false} onClick={scrollToLatest}>
      {label}
    </Link>
  );

  return (
    <nav className="pagination" aria-label="페이지 이동">
      {page > 1 ? pageLink(page - 1, "← 이전") : <span aria-disabled="true">← 이전</span>}
      {pages.map((target) =>
        target === page ? (
          <b key={target} aria-current="page">{target}</b>
        ) : (
          pageLink(target, String(target))
        ),
      )}
      {showGap && <span className="pagination-gap" aria-hidden="true">…</span>}
      {showLast && pageLink(totalPages, String(totalPages))}
      {page < totalPages ? pageLink(page + 1, "다음 →") : <span aria-disabled="true">다음 →</span>}
    </nav>
  );
}
