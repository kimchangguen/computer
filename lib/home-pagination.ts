// Shared by app/page.tsx, app/api/latest-posts/route.ts and
// components/HomeLatestPosts.tsx. Lives outside the "use client" component so
// server code gets the real values rather than client references.
export const HOME_POSTS_PER_PAGE = 16;
const PAGE_WINDOW_SIZE = 5;

export function parsePageParam(value: string | null): number {
  return Math.max(1, Number.parseInt(value ?? "1", 10) || 1);
}

// A sliding window of at most 5 page numbers around `page`, plus whether the
// last page sits beyond it (and needs a "…" gap before it).
// e.g. page 1/12 → 1-5 … 12, page 6/12 → 4-8 … 12, page 11/12 → 8-12.
export function getPageWindow(page: number, totalPages: number) {
  const start = Math.max(1, Math.min(page - 2, totalPages - PAGE_WINDOW_SIZE + 1));
  const end = Math.min(totalPages, start + PAGE_WINDOW_SIZE - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);
  return {
    pages,
    showLast: end < totalPages,
    showGap: end < totalPages - 1,
  };
}
