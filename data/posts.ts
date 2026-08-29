export type CategorySlug = "aa" | "bb" | "cc" | "dd" | "ee" | "ff";

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: CategorySlug;
  featuredImage: string | null;
  featuredImageAlt: string;
  publishedAt: string;
  // Full-precision publish timestamp (unlike publishedAt, which is
  // date-truncated for display). Used for prev/next adjacency so two posts
  // published on the same calendar day still order correctly.
  publishedAtISO: string;
  modifiedAt: string;
  tags: string[];
  author: string;
};

export const categories: Record<
  CategorySlug,
  { name: string; description: string; icon: string }
> = {
  aa: {
    name: "컴퓨터수리",
    description: "전원 · 부팅 · 화면 · 속도저하 등 데스크톱에서 발생하는 다양한 문제",
    icon: "PC",
  },
  bb: {
    name: "노트북수리",
    description: "충전 · 발열 · 액정 · 키보드 등 노트북 고장 진단과 관리 정보",
    icon: "NB",
  },
  cc: {
    name: "데이터복구",
    description: "하드디스크 · SSD · 외장하드의 데이터 손상과 복구 정보",
    icon: "DR",
  },
  dd: {
    name: "PC문제해결",
    description: "윈도우 오류 · 블루스크린 · 네트워크 문제를 단계별로 해결",
    icon: "TS",
  },
  ee: {
    name: "출장수리",
    description: "지역별 출장 점검과 실제 현장 수리 사례 및 서비스 안내",
    icon: "ON",
  },
  ff: {
    name: "수리정보",
    description: "수리 비용 · 고장 원인 · 자가진단 · 구매와 관리 가이드",
    icon: "GI",
  },
};

export const categoryMap: Record<CategorySlug, string> = {
  aa: "aa",
  bb: "bb",
  cc: "cc",
  dd: "dd",
  ee: "ee",
  ff: "ff",
};
