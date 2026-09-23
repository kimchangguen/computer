import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./HomeHero.module.css";

const graphics: { name: string; drawing: ReactNode }[] = [
  { name: "wifi", drawing: <><path d="M3 8.5a14 14 0 0 1 18 0M6 12a9 9 0 0 1 12 0M9 15.5a4.5 4.5 0 0 1 6 0"/><circle cx="12" cy="19" r="1"/></> },
  { name: "cloud", drawing: <path d="M7 18a5 5 0 1 1 .6-10A6 6 0 0 1 19 10a4 4 0 0 1-1 8Z"/> },
  { name: "monitor", drawing: <><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4M7 9l3 3 6-5"/></> },
  { name: "chip", drawing: <><rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 3v3m6-3v3M9 18v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3"/></> },
  { name: "tools", drawing: <path d="M14 6a5 5 0 0 0-6 6L3 17a2.8 2.8 0 0 0 4 4l5-5a5 5 0 0 0 6-6l-3 3-4-4 3-3Z"/> },
  { name: "shield", drawing: <><path d="m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/></> },
  { name: "drive", drawing: <><path d="m6 5-3 9m15-9 3 9M6 5h12"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 16.5h.01M11 16.5h.01"/></> },
  { name: "window", drawing: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01m3 0h.01M8 13l-2 2 2 2m8-4 2 2-2 2"/></> },
];

export function HomeHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.orbits} aria-hidden="true" />
      <div className={styles.graphics} aria-hidden="true">
        {graphics.map(({ name, drawing }) => (
          <div key={name} className={`${styles.card} ${styles[name]}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" focusable="false" aria-hidden="true">{drawing}</svg>
            {name === "monitor" && <span>PC CHECK</span>}
            {name === "chip" && <span>HARDWARE</span>}
          </div>
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.brand}>
          <Image src="/logo.png" alt="컴119" width={181} height={84} className={styles.logo} />
          <span className={styles.eyebrow}><i aria-hidden="true" />컴퓨터 수리 전문가가 직접 전하는 정보</span>
        </div>
        <h1>컴퓨터 문제가 생겼을 때,<br /><strong>가장 먼저 확인할 정보</strong></h1>
        <p className={styles.description}>컴퓨터 · 노트북 · 데이터복구 · 출장수리<br />컴119의 실제 수리 경험을 바탕으로 정확한 해결 방향을 안내합니다.</p>

        <form className={styles.search} action="/ff">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>
          <input name="q" aria-label="증상 검색" placeholder="증상을 검색해보세요. 예: 컴퓨터 전원이 안 켜져요" />
          <button type="submit">검색</button>
        </form>
        <div className={styles.quick}>
          <span>빠른 검색</span>
          {["전원불량", "화면안나옴", "부팅불량", "SSD", "데이터복구", "노트북발열"].map(x => <Link key={x} href={`/ff?q=${x}`}>{x}</Link>)}
        </div>
        <div className={styles.actions}>
          <Link className={styles.primary} href="/ff">수리정보 보기 <span aria-hidden="true">→</span></Link>
          <Link className={styles.secondary} href="/ee">출장수리 안내 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></Link>
        </div>
      </div>
    </section>
  );
}
