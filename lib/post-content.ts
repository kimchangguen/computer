function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// The auto-publisher inserts the featured image as the first element of the
// post body (`<figure><img …/></figure>` or a bare/`<p>`-wrapped `<img>`).
// The article page always renders the featured image as its cover, so that
// leading copy would show the same picture twice. Only an image that is the
// very first element of the body AND has the featured image's URL is removed;
// any other inline image (including later uses of the same URL) is kept, and
// the stored WordPress content itself is never modified.
export function stripLeadingFeaturedImage(html: string, featuredImage: string | null): string {
  if (!featuredImage) return html;
  const img = `<img\\b[^>]*\\bsrc="${escapeRegExp(featuredImage)}"[^>]*>`;
  const leading = new RegExp(
    `^\\s*(?:<figure[^>]*>\\s*${img}\\s*</figure>|<p[^>]*>\\s*${img}\\s*</p>|${img})\\s*`,
    "i",
  );
  return html.replace(leading, "");
}
