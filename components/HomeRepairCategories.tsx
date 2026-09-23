import Image from "next/image";
import Link from "next/link";
import { categories, type CategorySlug } from "@/data/posts";
import styles from "./HomeRepairCategories.module.css";

// Explicit slug mapping keeps each supplied image paired with its category.
const cards: { slug: CategorySlug; image: string; alt: string }[] = [
  { slug: "aa", image: "/0301.png", alt: "데스크톱 컴퓨터 본체" },
  { slug: "bb", image: "/0302.png", alt: "화면이 열린 노트북" },
  { slug: "cc", image: "/0303.png", alt: "하드디스크와 SSD 저장장치" },
  { slug: "dd", image: "/0304.png", alt: "윈도우 운영체제 그래픽" },
  { slug: "ee", image: "/0305.png", alt: "컴119 출장수리 차량과 공구함" },
  { slug: "ff", image: "/0306.png", alt: "수리정보 화면과 공구 아이콘" },
];

export function HomeRepairCategories() {
  return (
    <section className={styles.section} aria-labelledby="repair-categories-title">
      <div className={`shell ${styles.container}`}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>REPAIR CATEGORIES</span>
          <h2 id="repair-categories-title">주요 수리 분야</h2>
          <p>컴119의 전문 수리 분야를 확인하고 원하는 정보를 바로 찾아보세요.</p>
        </div>

        <div className={styles.grid}>
          {cards.map(({ slug, image, alt }, index) => {
            const category = categories[slug];
            return (
              <Link
                key={slug}
                href={`/${slug}`}
                className={styles.card}
                aria-labelledby={`repair-category-${slug}`}
              >
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.media}>
                  <Image
                    src={image}
                    alt={alt}
                    fill
                    sizes="(max-width: 600px) calc(100vw - 68px), (max-width: 1100px) 22vw, (max-width: 1220px) 15vw, 175px"
                    loading="lazy"
                    className={styles.image}
                  />
                </div>
                <div className={styles.copy}>
                  <span className={styles.badge} aria-hidden="true">{category.icon}</span>
                  <h3 id={`repair-category-${slug}`}>{category.name}</h3>
                  <p>{category.description}</p>
                  <span className={styles.more}>
                    자세히 보기
                    <span className={styles.arrow} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
