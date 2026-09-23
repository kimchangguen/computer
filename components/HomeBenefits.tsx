import type { ReactNode } from "react";
import styles from "./HomeBenefits.module.css";

const items: { title: string; desc: string; icon: ReactNode }[] = [
  {
    title: "전문 기술 정보",
    desc: "다양한 수리 경험을 바탕으로 한 전문 기술 정보를 제공합니다",
    icon: (
      <>
        <path d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4.8 20a7.3 7.3 0 0 1 12-5.6" />
        <circle cx="18" cy="18" r="4" />
        <path d="m16.3 18 1.2 1.2 2.2-2.4" />
      </>
    ),
  },
  {
    title: "정확한 진단",
    desc: "증상별 원인을 확인해 정확한 해결 방향을 안내합니다",
    icon: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m20 20-4.3-4.3" />
        <path d="m7.7 10.6 1.8 1.8 3.2-3.6" />
      </>
    ),
  },
  {
    title: "출장수리 안내",
    desc: "현장 방문 점검 및 출장 수리 서비스를 제공합니다",
    icon: (
      <>
        <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
        <circle cx="12" cy="9.5" r="2.4" />
      </>
    ),
  },
  {
    title: "데이터 복구 정보",
    desc: "손상된 데이터의 복구 방법과 사례를 안내합니다",
    icon: (
      <>
        <rect x="3" y="6" width="14" height="12" rx="2" />
        <path d="M6.5 12h7M6.5 15h4" />
        <path d="M18 9.5a3.5 3.5 0 1 1-1-2.5" />
        <path d="M18 6v3h-3" />
      </>
    ),
  },
  {
    title: "상담 지원",
    desc: "궁금한 점은 언제든 상담을 통해 안내받을 수 있습니다",
    icon: (
      <>
        <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
        <path d="M8 9h8M8 12.5h5" />
      </>
    ),
  },
];

export function HomeBenefits() {
  return (
    <section className={styles.strip} aria-label="컴119 핵심 서비스 안내">
      <div className={`shell ${styles.row}`}>
        {items.map(({ title, desc, icon }) => (
          <div className={styles.item} key={title}>
            <div className={styles.iconBox} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                {icon}
              </svg>
            </div>
            <div className={styles.text}>
              <p className={styles.itemTitle}>{title}</p>
              <p className={styles.itemDesc}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
