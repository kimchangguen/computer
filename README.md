# COM119 Headless Blog

컴퓨터 수리 전문업체 컴119의 콘텐츠 중심 블로그 프론트엔드입니다.

## 기술 구성

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- WordPress REST API 기반 콘텐츠 구조

## 실행

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
```

## 주요 경로

- `/` 홈
- `/aa` 컴퓨터수리
- `/bb` 노트북수리
- `/cc` 데이터복구
- `/dd` PC문제해결
- `/ee` 출장수리
- `/ff` 수리정보
- `/gg` 회사소개
- `/blog/[slug]` 블로그 상세

Vercel에서는 Next.js Framework Preset과 기본 Output Directory 설정을 사용합니다.
