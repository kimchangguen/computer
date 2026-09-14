export const SITE_URL = "https://www.computersuri.com";
export const SITE_NAME = "컴119";
// Shared OG/Twitter/JSON-LD logo image. Relative path resolves against
// metadataBase (set in app/layout.tsx) wherever it's passed straight into
// Metadata.openGraph/twitter; pass it through absoluteUrl() for JSON-LD
// fields, which require a fully-qualified URL.
export const SITE_IMAGE = "/ppp.png";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncate(text: string, maxLength = 155): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

// Escapes "<" so post content coming from WordPress can't break out of the
// <script type="application/ld+json"> tag it gets embedded in.
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export type BreadcrumbItem = { name: string; url: string };

// Builds BreadcrumbList structured data that mirrors the visible breadcrumb
// trail rendered on category and article pages, so the markup and the
// schema never disagree about the page's position in the site hierarchy.
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}
