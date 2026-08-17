import { SiteFrame } from "@/components/SiteFrame";

export default function Loading() {
  return <SiteFrame><main><article><div className="article-header"><div className="article-shell"><p className="empty-posts">게시글을 불러오는 중입니다…</p></div></div></article></main></SiteFrame>;
}
