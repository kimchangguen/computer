import Link from "next/link";
import { SiteFrame } from "@/components/SiteFrame";
import { CategoryGrid } from "@/components/CategoryGrid";

// Next.js serves this with a real 404 status automatically; it just needed
// a branded shell (instead of the framework default) so a mistyped or dead
// link still keeps the visitor inside the site's own navigation.
export default function NotFound() {
  return (
    <SiteFrame>
      <main>
        <section className="page-hero">
          <div className="shell">
            <span className="breadcrumb"><Link href="/">홈</Link> &nbsp;/&nbsp; 페이지를 찾을 수 없음</span>
            <h1>페이지를 찾을 수 없습니다</h1>
            <p>주소가 변경되었거나 삭제된 페이지일 수 있습니다. 아래에서 필요한 정보를 다시 찾아보세요.</p>
          </div>
        </section>
        <section className="section categories-section">
          <div className="shell">
            <div className="section-head">
              <div>
                <span className="section-kicker">REPAIR CATEGORIES</span>
                <h2>주요 수리 분야</h2>
              </div>
            </div>
            <CategoryGrid />
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
