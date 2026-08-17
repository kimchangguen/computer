import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {metadataBase:new URL("https://com119.example"),title:{default:"컴119 | 컴퓨터 수리 전문 정보",template:"%s | 컴119"},description:"컴퓨터·노트북 수리, 데이터복구, PC 문제 해결을 위한 전문 기술 정보",alternates:{canonical:"/"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
