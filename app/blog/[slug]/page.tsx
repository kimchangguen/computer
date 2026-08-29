import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/SiteFrame";
import { PostGrid } from "@/components/PostCard";
import { CategoryCTA } from "@/components/CategoryCTA";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { categories, type Post } from "@/data/posts";
import { getAdjacentPosts, getPostBySlug, getPosts, getRelatedPosts } from "@/lib/wordpress";
import { SITE_NAME, SITE_URL, absoluteUrl, jsonLd, truncate } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// Korean body copy reads at roughly 350–450 characters per minute; this is a
// display-only estimate (not stored, not sent anywhere) so a post never
// shows the same hardcoded "5분" regardless of its actual length.
function estimateReadingMinutes(html: string) {
  const chars = html.replace(/<[^>]*>/g, "").replace(/\s+/g, "").length;
  return Math.max(1, Math.round(chars / 400));
}

type TocItem = { id: string; text: string; level: 2 | 3 };

// Some WordPress posts already embed their own table-of-contents plugin
// output (ez-toc, lwptoc, etc. — see the .toc/.ez-toc-container/.lwptoc
// selectors below); generating a second auto-TOC on top of that would just
// duplicate it, so this bails out and renders the content unmodified.
const EMBEDDED_TOC_PATTERN = /class="[^"]*\b(toc|ez-toc-container|lwptoc)\b[^"]*"|id="toc_container"/i;

// Tags an id onto every <h2>/<h3> in the WordPress HTML (reusing one already
// present rather than adding a duplicate) so the generated TOC below can
// link to it. This only ever adds/reads an id attribute — it never touches
// the heading text or any other markup, so the published content itself
// stays exactly as WordPress rendered it.
function buildToc(html: string): { html: string; items: TocItem[] } {
  if (EMBEDDED_TOC_PATTERN.test(html)) return { html, items: [] };
  let counter = 0;
  const items: TocItem[] = [];
  const withIds = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_match, level: string, attrs: string, inner: string) => {
    const existingId = /id="([^"]+)"/.exec(attrs);
    counter += 1;
    const id = existingId ? existingId[1] : `toc-${counter}`;
    const text = inner.replace(/<[^>]+>/g, "").trim();
    if (text) items.push({ id, text, level: Number(level) as 2 | 3 });
    return `<h${level}${existingId ? attrs : `${attrs} id="${id}"`}>${inner}</h${level}>`;
  });
  return { html: withIds, items };
}

// Matches WORDPRESS_REVALIDATE_SECONDS: lets Next.js cache the rendered page
// (ISR) instead of re-rendering on every click. force-dynamic previously
// disabled this cache entirely, forcing a full WordPress round-trip per visit.
export const revalidate = 120;

// Without this, Next.js treats /blog/[slug] as fully dynamic (no route
// caching at all, matching the [category] page's own generateStaticParams
// pattern) since it has no way to know which slugs exist ahead of time.
// dynamicParams stays true (default), so a brand new post not yet in this
// list still renders on its first visit and gets cached from then on.
//
// WordPress returns non-Latin slugs already percent-encoded (e.g. Korean
// titles come back as "%ec%83%88-..."). generateStaticParams expects the
// decoded segment value and encodes it itself when building the route, so
// passing the already-encoded slug through as-is double-encodes it — Next
// then bakes a static page for the wrong path, and every real visit (which
// requests the correctly single-encoded URL) falls through to a 404.
export async function generateStaticParams() {
  const { posts } = await getPosts({ perPage: 100 }).catch(() => ({ posts: [] }));
  return posts.map((post) => {
    try {
      return { slug: decodeURIComponent(post.slug) };
    } catch {
      return { slug: post.slug };
    }
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug).catch(() => null);
  if (!post) return {};
  const description = truncate(post.excerpt);
  const images = post.featuredImage ? [post.featuredImage] : [];
  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: post.title,
      description,
      images,
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.modifiedAt || undefined,
    },
    twitter: { card: images.length > 0 ? "summary_large_image" : "summary", title: post.title, description, images },
  };
}

function blogPostingJsonLd(post: Post) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: truncate(post.excerpt),
    image: post.featuredImage ? [post.featuredImage] : undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post.modifiedAt || post.publishedAt || undefined,
    author: { "@type": "Organization", name: post.author || SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${SITE_URL}/ppp.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

export default async function BlogPost({ params }: Props) {
  // Not caught here on purpose: getPostBySlug() only returns null when
  // WordPress genuinely has no matching post (200 + empty array). A real
  // API failure (network error, timeout, 5xx) throws instead and should
  // surface as an error page, not silently masquerade as notFound().
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();
  const category = categories[post.category];
  // Awaited inline (not streamed): a Suspense boundary here would opt the
  // whole route out of ISR full-page caching, which is the main win for
  // near-instant repeat visits. getRelatedPosts/getAdjacentPosts are
  // themselves cached via WORDPRESS_REVALIDATE_SECONDS, so this stays cheap
  // once warm.
  const related = await getRelatedPosts(post, 4).catch(() => []);
  const adjacent = await getAdjacentPosts(post).catch(() => ({ older: null, newer: null }));
  const showFeaturedImage = post.featuredImage && !post.content.includes(post.featuredImage);
  const readingMinutes = estimateReadingMinutes(post.content);
  const toc = buildToc(post.content);
  const pageUrl = absoluteUrl(`/blog/${post.slug}`);

  return <SiteFrame><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(blogPostingJsonLd(post)) }}/><main><article><header className="article-header"><div className="article-shell"><div className="breadcrumb"><Link href="/">홈</Link> &nbsp;/&nbsp; <Link href={`/${post.category}`}>{category.name}</Link></div><span className="category-label">{category.name}</span><h1>{post.title}</h1><p>{post.excerpt}</p><div className="article-meta"><time>{post.publishedAt.replaceAll("-", ".")}</time><span>{post.author}</span><span>읽는 시간 {readingMinutes}분</span><CopyLinkButton url={pageUrl}/></div></div></header><div className={`article-cover tone-display${showFeaturedImage ? " has-image" : ""}`}>{showFeaturedImage ? <img src={post.featuredImage!} alt={post.featuredImageAlt || post.title} loading="eager" fetchPriority="high"/> : <span>{category.icon}</span>}<b>COM119 TECH NOTE</b></div>{post.excerpt && <div className="summary-box"><b>핵심 요약</b><p>{post.excerpt}</p></div>}{toc.items.length > 0 && <nav className="article-toc" aria-label="목차"><b>목차</b><ol>{toc.items.map((item) => <li key={item.id} className={item.level === 3 ? "toc-h3" : undefined}><a href={`#${item.id}`}>{item.text}</a></li>)}</ol></nav>}<div className="article-content" dangerouslySetInnerHTML={{ __html: toc.html }}/>{post.tags.length > 0 && <div className="tag-row">{post.tags.map((tag) => <Link key={tag} href={`/ff?q=${encodeURIComponent(tag)}`}>#{tag}</Link>)}</div>}<div className="author-box"><span className="author-avatar">{post.author.slice(0, 1)}</span><div><b>{post.author}</b><p>컴퓨터 수리 현장 경험을 바탕으로 정확하고 실용적인 정보를 전합니다.</p></div></div><nav className="post-nav" aria-label="이전글 다음글">{adjacent.older ? <Link className="post-nav-link prev" href={`/blog/${adjacent.older.slug}`}><span>← 이전 글</span><b>{adjacent.older.title}</b></Link> : <span/>}<Link className="post-nav-list" href={`/${post.category}`}>목록으로</Link>{adjacent.newer ? <Link className="post-nav-link next" href={`/blog/${adjacent.newer.slug}`}><span>다음 글 →</span><b>{adjacent.newer.title}</b></Link> : <span/>}</nav></article><section className="section related"><div className="shell"><div className="section-head"><div><span className="section-kicker">RELATED CONTENT</span><h2>관련 글</h2></div><div className="other-categories"><span>다른 카테고리</span>{Object.entries(categories).slice(0, 3).map(([slug, item]) => <Link key={slug} href={`/${slug}`}>{item.name}</Link>)}</div></div><PostGrid posts={related}/></div></section><CategoryCTA/></main></SiteFrame>;
}
