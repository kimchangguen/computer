export const SITE_URL = "https://www.computersuri.com";
export const SITE_NAME = "컴119";

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
