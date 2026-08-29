import Link from "next/link";
export function CategoryCTA(){return <section className="category-cta"><div className="shell"><h2>컴퓨터 문제,<br/>지금 확인하세요</h2><p>컴퓨터수리·노트북수리·데이터복구까지<br/>필요한 내용을 빠르게 확인하세요.</p><div className="cta-actions"><Link className="btn primary" href="/ee">출장수리 안내 <span>→</span></Link><Link className="btn ghost" href="/gg">회사소개 보기</Link></div></div></section>}
