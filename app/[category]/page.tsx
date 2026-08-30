import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/SiteFrame";
import { CategoryListing, ListingBody } from "@/components/CategoryListing";
import { CategoryCTA } from "@/components/CategoryCTA";
import { categories, type CategorySlug } from "@/data/posts";
import { getPostsByCategory } from "@/lib/wordpress";
import { SITE_NAME } from "@/lib/seo";

type Props = {
  params: Promise<{ category: string }>;
};

export const revalidate = 120;

export function generateStaticParams() {
  return [...Object.keys(categories), "gg"].map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (category === "gg") {
    const title = "회사소개";
    const description = "컴119 소개와 서비스 운영 방향";
    return {
      title,
      description,
      alternates: { canonical: "/gg" },
      openGraph: { type: "website", url: "/gg", siteName: SITE_NAME, title, description },
      twitter: { card: "summary", title, description },
    };
  }
  const current = categories[category as CategorySlug];
  if (!current) return {};
  return {
    title: current.name,
    description: current.description,
    alternates: { canonical: `/${category}` },
    openGraph: { type: "website", url: `/${category}`, siteName: SITE_NAME, title: current.name, description: current.description },
    twitter: { card: "summary", title: current.name, description: current.description },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (category === "gg") return <About />;
  const current = categories[category as CategorySlug];
  if (!current) notFound();

  // perPage=10 on the first page yields 1 featured post + 9 grid posts (3
  // clean rows of 3), matching the reference layout's featured+grid split.
  // Always page 1, no search: page.tsx never reads searchParams, so this
  // render stays static/ISR (see CategoryListing.tsx for how ?page=/?q= are
  // handled without forcing the whole route to dynamic rendering).
  const initial = await getPostsByCategory(category as CategorySlug, 1, 10).catch(() => ({ posts: [], total: 0, totalPages: 0 }));

  return (
    <SiteFrame>
      <main>
        <section className="category-hero">
          <div className="shell">
            <span className="breadcrumb">홈 &nbsp;/&nbsp; {current.name}</span>
            <span className="section-kicker light">COM119 TECH CONTENT</span>
            <h1>{current.name}</h1>
            <p>{current.description}</p>
          </div>
        </section>
        <Suspense
          fallback={
            <ListingBody
              category={category as CategorySlug}
              categoryName={current.name}
              icon={current.icon}
              result={initial}
              page={1}
            />
          }
        >
          <CategoryListing
            category={category as CategorySlug}
            categoryName={current.name}
            icon={current.icon}
            initial={initial}
          />
        </Suspense>
        <CategoryCTA />
      </main>
    </SiteFrame>
  );
}

function About(){return <SiteFrame><main><section className="page-hero about-hero"><div className="shell"><span className="section-kicker">ABOUT COM119</span><h1>문제를 이해하는 것부터<br/>수리는 시작됩니다.</h1><p>컴119는 컴퓨터 문제 해결 경험을 바탕으로 정확하고 실용적인 정보를 전합니다.</p></div></section><section className="section"><div className="shell about-grid"><div><span className="section-kicker">WHO WE ARE</span><h2>컴119 소개</h2></div><div><p className="lead">컴119는 컴퓨터와 노트북 수리, 데이터복구, 출장 점검 서비스를 제공하는 컴퓨터 수리 전문업체입니다.</p><p>이 사이트는 사용자가 증상을 이해하고 올바른 해결 방향을 찾을 수 있도록 실제 현장에서 쌓은 경험을 정보로 정리하는 전문 콘텐츠 채널입니다.</p></div></div><div className="shell value-grid">{[["01","주요 서비스","컴퓨터·노트북 점검, 데이터복구, 네트워크와 출장 서비스"],["02","운영 방향","과장보다 정확한 정보, 광고보다 문제 해결에 집중합니다."],["03","상담 안내","자가진단이 어렵거나 데이터가 중요할 때 점검 방향을 안내합니다."]].map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section></main></SiteFrame>}
