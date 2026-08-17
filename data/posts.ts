export type CategorySlug="aa"|"bb"|"cc"|"dd"|"ee"|"ff";
export type Post={id:number;slug:string;title:string;excerpt:string;content:string;category:CategorySlug;featuredImage:string;publishedAt:string;tags:string[]};
export const categories:Record<CategorySlug,{name:string;description:string;icon:string}>={
 "aa":{name:"컴퓨터수리",description:"전원 · 부팅 · 화면 · 속도저하 등 데스크톱에서 발생하는 다양한 문제",icon:"PC"},
 "bb":{name:"노트북수리",description:"충전 · 발열 · 액정 · 키보드 등 노트북 고장 진단과 관리 정보",icon:"NB"},
 "cc":{name:"데이터복구",description:"하드디스크 · SSD · 외장하드의 데이터 손상과 복구 정보",icon:"DR"},
 "dd":{name:"PC문제해결",description:"윈도우 오류 · 블루스크린 · 네트워크 문제를 단계별로 해결",icon:"TS"},
 "ee":{name:"출장수리",description:"지역별 출장 점검과 실제 현장 수리 사례 및 서비스 안내",icon:"ON"},
 "ff":{name:"수리정보",description:"수리 비용 · 고장 원인 · 자가진단 · 구매와 관리 가이드",icon:"GI"}
};
const body=`<p>갑자기 문제가 발생하면 당황하기 쉽지만, 먼저 증상을 정확히 구분하는 것이 중요합니다. 전원 상태와 연결 장치를 차례로 확인하면 불필요한 분해 없이 원인을 좁힐 수 있습니다.</p><h2>가장 먼저 확인할 항목</h2><p>컴퓨터에 연결된 전원 케이블과 멀티탭, 모니터 입력 신호를 확인합니다. 최근에 추가한 장치가 있다면 잠시 분리한 뒤 다시 시작해 보세요.</p><ul><li>전원 표시등과 팬 작동 여부</li><li>모니터 입력 소스와 영상 케이블</li><li>부팅음 또는 메인보드 진단 표시</li></ul><div class="info-box"><strong>정보</strong><p>증상이 발생한 시점과 직전에 했던 작업을 기록하면 진단 시간을 줄이는 데 도움이 됩니다.</p></div><h2>증상에 따라 원인 좁히기</h2><h3>전원은 들어오지만 화면이 없는 경우</h3><p>메모리 접촉, 그래픽카드, 영상 출력 포트 문제를 우선 확인합니다. 부품을 직접 분리하기 어렵다면 무리하지 말고 전문가에게 점검을 요청하세요.</p><blockquote>같은 증상이라도 원인은 다를 수 있습니다. 중요한 데이터가 있다면 반복적인 강제 종료를 피하는 것이 좋습니다.</blockquote><table><thead><tr><th>증상</th><th>우선 확인</th><th>주의사항</th></tr></thead><tbody><tr><td>전원 무반응</td><td>케이블·멀티탭</td><td>파워 분해 금지</td></tr><tr><td>화면 없음</td><td>모니터·케이블</td><td>출력 포트 확인</td></tr></tbody></table><div class="warn-box"><strong>주의</strong><p>타는 냄새나 스파크가 있었다면 전원 연결을 중단하고 점검을 받으세요.</p></div><h2>자주 묻는 질문</h2><h3>직접 점검해도 괜찮을까요?</h3><p>외부 케이블과 설정 확인까지는 가능하지만, 보증기간 중인 제품이나 내부 부품 분해는 전문가와 상담하는 편이 안전합니다.</p>`;
export const posts:Post[]=[
 {id:1,slug:"pc-power-on-no-display",title:"컴퓨터 전원은 들어오는데 화면이 나오지 않는 원인",excerpt:"모니터부터 메모리, 그래픽카드까지 증상별 확인 순서를 정리했습니다.",content:body,category:"aa",featuredImage:"display",publishedAt:"2026-08-12",tags:["화면안나옴","그래픽카드","메모리"]},
 {id:2,slug:"laptop-not-charging",title:"노트북 충전기를 연결해도 충전되지 않는 경우",excerpt:"어댑터와 충전 단자, 배터리 상태를 안전하게 확인하는 방법입니다.",content:body,category:"bb",featuredImage:"charge",publishedAt:"2026-08-08",tags:["노트북","충전","배터리"]},
 {id:3,slug:"external-drive-not-recognized",title:"외장하드가 갑자기 인식되지 않을 때 확인할 사항",excerpt:"데이터 손상을 줄이면서 연결 상태와 디스크 반응을 확인해 보세요.",content:body,category:"cc",featuredImage:"drive",publishedAt:"2026-08-03",tags:["외장하드","인식불량","데이터복구"]},
 {id:4,slug:"windows-reboot-loop",title:"윈도우 부팅 중 계속 재부팅되는 원인",excerpt:"업데이트, 드라이버, 저장장치 오류를 구분하는 기본 진단 순서입니다.",content:body,category:"dd",featuredImage:"windows",publishedAt:"2026-07-28",tags:["윈도우","재부팅","부팅불량"]},
 {id:5,slug:"ssd-failure-signs",title:"SSD가 고장 나기 전에 나타나는 증상",excerpt:"속도 저하와 파일 오류 등 놓치기 쉬운 이상 신호를 살펴봅니다.",content:body,category:"ff",featuredImage:"ssd",publishedAt:"2026-07-21",tags:["SSD","백업","저장장치"]},
 {id:6,slug:"laptop-fan-noise",title:"노트북 팬 소음이 갑자기 커지는 이유",excerpt:"발열과 먼지, 백그라운드 작업을 확인하고 과열을 예방하는 방법입니다.",content:body,category:"bb",featuredImage:"fan",publishedAt:"2026-07-15",tags:["노트북발열","팬소음","청소"]},
 {id:7,slug:"blue-screen-first-check",title:"블루스크린이 반복될 때 가장 먼저 볼 것",excerpt:"오류 코드 확인부터 메모리와 드라이버 점검까지 핵심만 안내합니다.",content:body,category:"dd",featuredImage:"blue",publishedAt:"2026-07-09",tags:["블루스크린","오류코드","윈도우"]},
 {id:8,slug:"onsite-network-repair",title:"사무실 인터넷이 자주 끊기는 현장 점검 사례",excerpt:"공유기만의 문제가 아니었던 네트워크 장애 점검 과정을 소개합니다.",content:body,category:"ee",featuredImage:"network",publishedAt:"2026-07-02",tags:["출장수리","네트워크","인터넷"]}
];
export const getPostsByCategory=(slug:string)=>posts.filter(p=>p.category===slug);
export const getPost=(slug:string)=>posts.find(p=>p.slug===slug);
