import Link from "next/link";
import { SiteFrame } from "@/components/SiteFrame";
import {CategoryGrid} from "@/components/CategoryGrid";
import {PostGrid} from "@/components/PostCard";
import {ServiceCTA} from "@/components/ServiceCTA";
import {getLatestPosts} from "@/lib/wordpress";

export const revalidate = 120;

export default async function Home() {
  const posts = await getLatestPosts(8).catch(() => []);
  return <SiteFrame><main><section className="hero"><div className="hero-grid shell">
    <div className="hero-copy"><span className="eyebrow"><i />컴퓨터 수리 전문가가 직접 전하는 정보</span><h1>컴퓨터 문제가 생겼을 때,<br /><strong>가장 먼저 확인할 정보</strong></h1><p>컴퓨터 · 노트북 · 데이터복구 · 출장수리<br />컴119의 실제 수리 경험을 바탕으로 정확한 해결 방향을 안내합니다.</p>
      <form className="search" action="/ff"><span aria-hidden="true">⌕</span><input name="q" aria-label="증상 검색" placeholder="증상을 검색해보세요. 예: 컴퓨터 전원이 안 켜져요" /><button>검색</button></form>
      <div className="quick"><span>빠른 검색</span>{["전원불량","화면안나옴","부팅불량","SSD","데이터복구","노트북발열"].map(x=><Link key={x} href={`/ff?q=${x}`}>{x}</Link>)}</div>
      <div className="hero-actions"><Link className="btn primary" href="/ff">수리정보 보기 <span>→</span></Link><Link className="btn ghost" href="/ee">출장수리 안내</Link></div>
    </div>
    <div className="hero-visual" aria-label="컴퓨터 진단 작업을 표현한 그래픽"><div className="device"><div className="device-top"><span/><span/><span/></div><div className="diagnostic"><b>PC DIAGNOSTIC</b><div className="line wide"/><div className="line"/><div className="status"><i/>SYSTEM CHECK <strong>정상</strong></div><div className="bars"><i/><i/><i/><i/><i/></div></div></div><div className="chip">CPU <small>TECH CHECK</small></div><div className="metric"><b>98%</b><span>진단 진행률</span></div><div className="tech-note"><i>✓</i><span><b>전문 기술 정보</b>실제 수리 경험 기반</span></div></div>
  </div></section>
  <section className="section categories-section"><div className="shell"><div className="section-head"><div><span className="section-kicker">REPAIR CATEGORIES</span><h2>주요 수리 분야</h2></div><p>필요한 정보를 분야별로 빠르게 찾아보세요.<br/>실제 점검 경험을 바탕으로 정리했습니다.</p></div><CategoryGrid/></div></section>
  <section className="section latest-section"><div className="shell"><div className="section-head"><div><span className="section-kicker">LATEST CONTENT</span><h2>최신 수리 콘텐츠</h2></div><Link className="all-link" href="/ff">전체 콘텐츠 보기 <span>→</span></Link></div><PostGrid posts={posts.slice(0,8)}/></div></section>
  <section className="section symptoms-section"><div className="shell symptom-grid"><div><span className="section-kicker">FIND BY SYMPTOM</span><h2>어떤 문제가<br/>발생했나요?</h2><p>현재 겪고 있는 증상을 선택하면<br/>관련 해결 정보를 바로 확인할 수 있습니다.</p></div><div className="symptom-links">{["전원이 안 켜져요","화면이 안 나와요","컴퓨터가 너무 느려요","부팅이 안 돼요","블루스크린이 나와요","인터넷이 안 돼요","저장장치가 인식되지 않아요","파일을 삭제했어요","노트북이 너무 뜨거워요","컴퓨터가 계속 꺼져요","소음이 심해졌어요","윈도우 오류가 발생해요"].map((x,i)=><Link href={`/ff?q=${x}`} key={x}><span>{String(i+1).padStart(2,"0")}</span>{x}<b>→</b></Link>)}</div></div></section>
  <ServiceCTA/>
  </main></SiteFrame>;
}
