import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const DEFAULT_TITLE = "컴119 | 컴퓨터 수리 전문 정보";
const DEFAULT_DESCRIPTION = "컴퓨터·노트북 수리, 데이터복구, PC 문제 해결을 위한 전문 기술 정보. 컴119의 실제 수리 경험을 바탕으로 정확한 해결 방향을 안내합니다.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: "%s | 컴119" },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  icons: { icon: "/ppp.png", shortcut: "/ppp.png", apple: "/ppp.png" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: "/ppp.png", alt: SITE_NAME }],
  },
  twitter: {
    card: "summary",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/ppp.png"],
  },
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
