import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/SiteFrame";
import { PostGrid } from "@/components/PostCard";
import { ServiceCTA } from "@/components/ServiceCTA";
import { categories } from "@/data/posts";
import { getPostBySlug, getPosts, getRelatedPosts } from "@/lib/wordpress";

type Props = { params: Promise<{ slug: string }> };

// Matches WORDPRESS_REVALIDATE_SECONDS: lets Next.js cache the rendered page
// (ISR) instead of re-rendering on every click. force-dynamic previously
// disabled this cache entirely, forcing a full WordPress round-trip per visit.
export const revalidate = 120;

// Without this, Next.js treats /blog/[slug] as fully dynamic (no route
// caching at all, matching the [category] page's own generateStaticParams
// pattern) since it has no way to know which slugs exist ahead of time.
// dynamicParams stays true (default), so a brand new post not yet in this
// list still renders on its first visit and gets cached from then on.
export async function generateStaticParams() {
  const { posts } = await getPosts({ perPage: 100 }).catch(() => ({ posts: [] }));
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug).catch(() => null);
  if (!post) return {};
  const images = post.featuredImage ? [post.featuredImage] : [];
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, images },
    twitter: { title: post.title, description: post.excerpt, images },
  };
}

export default async function BlogPost({ params }: Props) {
  const post = await getPostBySlug((await params).slug).catch(() => null);
  if (!post) notFound();
  const category = categories[post.category];
  // Awaited inline (not streamed): a Suspense boundary here would opt the
  // whole route out of ISR full-page caching, which is the main win for
  // near-instant repeat visits. getRelatedPosts is itself cached via
  // WORDPRESS_REVALIDATE_SECONDS, so this stays cheap once warm.
  const related = await getRelatedPosts(post, 3).catch(() => []);
  const showFeaturedImage = post.featuredImage && !post.content.includes(post.featuredImage);

  return <SiteFrame><main><article><header className="article-header"><div className="article-shell"><div className="breadcrumb"><Link href="/">홈</Link> &nbsp;/&nbsp; <Link href={`/${post.category}`}>{category.name}</Link></div><span className="category-label">{category.name}</span><h1>{post.title}</h1><p>{post.excerpt}</p><div className="article-meta"><time>{post.publishedAt.replaceAll("-", ".")}</time><span>컴119 기술팀</span><span>읽는 시간 5분</span></div></div></header><div className={`article-cover tone-display${showFeaturedImage ? " has-image" : ""}`}>{showFeaturedImage ? <img src={post.featuredImage!} alt={post.featuredImageAlt || post.title}/> : <span>{category.icon}</span>}<b>COM119 TECH NOTE</b></div><div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }}/>{post.tags.length > 0 && <div className="tag-row">{post.tags.map((tag) => <Link key={tag} href={`/ff?q=${encodeURIComponent(tag)}`}>#{tag}</Link>)}</div>}</article><section className="section related"><div className="shell"><div className="section-head"><div><span className="section-kicker">RELATED CONTENT</span><h2>관련 글</h2></div><div className="other-categories"><span>다른 카테고리</span>{Object.entries(categories).slice(0, 3).map(([slug, item]) => <Link key={slug} href={`/${slug}`}>{item.name}</Link>)}</div></div><PostGrid posts={related}/></div></section><ServiceCTA/></main></SiteFrame>;
}
