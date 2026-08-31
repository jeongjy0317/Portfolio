// All content sourced from Joon_CV.pdf, matching the wording in reference/*.dc.html.

export interface NavItem {
  id: string;
  label: string;
}

export interface Profile {
  nameKo: string;
  nameEn: string;
  nickname: string;
  birth: string;
  eyebrow: string;
  tagline: string;
  email: string;
  github: string;
  githubHref: string;
  linkedin: string;
  linkedinHref: string;
}

export interface About {
  title: string;
  description: string[];
}

export interface Project {
  id: string;
  title: string;
  period: string;
  tag: string;
  subtitle: string;
  images: GalleryImage[];
  points: string[];
  /** 프로젝트 GitHub 저장소 URL. 비어 있으면 링크를 노출하지 않습니다. */
  githubHref?: string;
}

/** Always a real asset — there is no placeholder form, so an entry without a
 *  scan simply omits `images` rather than reserving an empty frame. */
export interface GalleryImage {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
}

/** Shared shape for the date/title/subtitle + gallery + bullets article. */
export interface TimelineItem {
  id: string;
  period: string;
  place?: string | null;
  title: string;
  org?: string | null;
  images?: GalleryImage[];
  imageLabel?: string;
  points: string[];
}

export interface Cert {
  id: string;
  date: string;
  expires: string;
  title: string;
  sub: string;
  /** Scanned certificate. The image slot is dropped entirely when unset. */
  image?: GalleryImage;
}

export interface Award {
  title: string;
  detail: string;
  date: string;
  /** Gallery heading on the detail page. Defaults to "증빙 자료". */
  imageLabel?: string;
  /** Scanned 상장. The image slot is dropped entirely when unset. */
  images?: GalleryImage[];
}

export interface Publication {
  title: string;
  venue: string;
  authors: string;
}

export type Skill =
  | { label: string; type: "text"; text: string }
  | { label: string; type: "tags"; tags: string[] };

export interface Activity {
  title: string;
  date: string;
  team: string;
  imageLabel?: string;
  images?: GalleryImage[];
  points?: string[];
}

export const profile: Profile = {
  nameKo: "정준영",
  nameEn: "Joonyoung Jeong",
  nickname: "zer0base",
  birth: "2001. 03. 17.",
  eyebrow: "Vulnerability Analyst — Portfolio",
  tagline: "I break systems to find out how they should be built.",
  email: "jeongjy0317@gmail.com",
  github: "github.com/jeongjy0317",
  githubHref: "https://github.com/jeongjy0317",
  linkedin: "linkedin.com/in/zer0base",
  linkedinHref: "https://linkedin.com/in/zer0base",
};

// ---------------------------------------------------------------- About
// A single static statement — one headline plus the body paragraphs.
export const about: About = {
  title: "Think Offensive,\nBuild Defensive.",
  description: [
    "취약점이 사고로 이어지기 전에 시스템 설계 단계에서부터 보안을 내재화하는 방법을 배우고 있습니다. 군 복무 중에는 정보보호 실무를 수행했으며, 다양한 버그 바운티 프로그램에서 웹과 모바일 애플리케이션 등의 취약점을 발견해 제보했습니다. 이런 경험을 거치면서 보안을 개발의 장애물이 아닌 개발 과정의 필수 요소로 만드는 일에 큰 관심을 갖게 되었습니다.",
    "저는 늘 겸손하게 기본부터 시작하고, 끊임없이 배우겠다는 다짐을 담아 “zer0base”라는 닉네임으로 활동합니다. CTF라는 경쟁의 장과 실제 취약점 연구를 통해 공격자와 방어자 관점을 모두 고려하는 사고방식을 다져왔으며, 이를 바탕으로 보안 연구와 풀스택 개발을 함께 수행하고 있습니다.",
    "졸업을 앞두고, 웹 또는 네이티브 애플리케이션과 그에 연결된 환경을 안전하게 보호하는 실무 경험을 쌓을 수 있는 기회를 찾고 있습니다. 사람들이 신뢰하고 사용하는 시스템을 함께 지키며 성장해 나가고 싶습니다.",
  ],
};

// -------------------------------------------------------------- Projects (4)
export const projects: Project[] = [
  {
    id: "pj-ghidra",
    title: "Ghidra’s Paradise",
    period: "2026.05.29 – 현재",
    tag: "Github 오픈소스 · 개인 프로젝트",
    subtitle: "Ghidra 기반 리버스 엔지니어링 초동 분석 과정 자동화 플러그인",
    githubHref: "", // TODO: 실제 GitHub 저장소 URL 입력
    images: [],
    points: [
      "Ghidra를 활용한 바이너리 분석 과정을 체계화하고, 반복적인 정적 분석 흐름을 자동화하여 보조하는 플러그인 1인 개발 및 오픈소스 배포.",
      "함수 구조, 문자열, 참조 관계 등 핵심 분석 단서를 중심으로 취약점 탐색과 악성 행위 이해에 필요한 리버스 엔지니어링 워크플로우를 구축.",
    ],
  },
  {
    id: "pj-iac",
    title: "IaC-Rule Set & MCP 기반 정책 감사 도구",
    period: "2025.03.03 – 현재",
    tag: "오픈소스 · 팀 프로젝트(개발중)",
    subtitle: "AI 오케스트레이터 기반 클라우드 IaC 보안 분석 솔루션",
    githubHref: "", // TODO: 실제 GitHub 저장소 URL 입력
    images: [],
    points: [
      "공급망 공격 및 클라우드 대상 공격 증가 흐름에 대응해, 클라우드 환경에서 놓치기 쉬운 IaC 설정 오류를 조기 발견하는 보안 분석 솔루션을 개발.",
      "스캐너와 취약점 DB를 통합하고, MCP 기반 AI 오케스트레이터가 정책 룰셋 선택, 분석 결과 수집, 위험도 정리를 수행하는 구조를 설계.",
      "팀장으로서 전체 아키텍처 설계와 핵심 구현을 주도하여, 교내 학술제 현업자 심사에서 대상 수상.",
    ],
  },
  {
    id: "pj-bwasp",
    title: "BWASP",
    period: "2021.09.03 – 현재",
    tag: "BoB Web Application Security Project · Github 오픈소스 · 팀 프로젝트",
    subtitle: "웹 취약점 수동 분석 보조 솔루션",
    githubHref: "", // TODO: 실제 GitHub 저장소 URL 입력
    images: [],
    points: [
      "BoB 교육에서 시작된 프로젝트로, 웹 수동 분석을 보조하는 오픈소스 솔루션 개발에 팀원으로 참여.",
      "동작 아키텍처와 내부 DB 스키마를 설계하고 프론트엔드 구현을 담당하여 분석 결과를 수집·정리·활용하는 흐름을 구축.",
      "관련 논문을 2021 한국정보보호학회 동계학술대회에 투고하고, 웹서버 가용성을 훼손하지 않는 공격 벡터 탐색 방안으로 Strong accept 평가 획득.",
      "KitPloit, Kali Linux Tutorials 등 다수 해외 보안 매체 및 채널에 소개. Docker 기반 배포 환경과 유지보수 편의성 개선 업데이트를 지속 기여 중.",
    ],
  },
  {
    id: "pj-dropperapi",
    title: "Dropper API: COVID-19 정보 통합 API",
    period: "2020.03.11 – 2020.12.21",
    tag: "Github 오픈소스 · 공익적 팀 프로젝트",
    subtitle: "정부·지자체 COVID-19 공개 데이터를 통합 제공한 공공 데이터 API",
    githubHref: "", // TODO: 실제 GitHub 저장소 URL 입력
    images: [],
    points: [
      "신종 코로나바이러스 관련 정부 및 각 지자체에 파편화된 공개 데이터를 한데 모아, 개발자가 별도 데이터 수집 없이 코로나 정보 제공 서비스를 빠르게 구축할 수 있는 API를 제공.",
      "프로젝트 팀장으로서 프로젝트 운영과 데이터 이슈 대응을 총괄하며, 서비스 개발자가 데이터 관리 부담보다 이용자 경험과 기능 구현에 집중할 수 있도록 지원.",
      "정부 Open API에 관련 기능이 정식 추가된 이후 프로젝트의 공익적 역할을 마무리하고, 2020.12.21 자 서비스 종료.",
    ],
  },
];

// ------------------------------------------------------- Experience (3 + 4)
export const experienceWork: TimelineItem[] = [
  {
    id: "ex-mentor",
    period: "2026.04.02 – 현재",
    place: "부산, 대한민국",
    title: "전공동아리 프로젝트 멘토(시간제, 계약직)",
    org: "부산소프트웨어마이스터고등학교",
    points: [
      "2학년 학생들의 전공동아리 프로젝트를 대상으로 프로젝트 기획, 구현, 발표 준비 등 진행 전반을 멘토링하고 가이드.",
      "프로젝트 일정 조율과 진행 상황 점검을 수행하며, 기술적 의사결정 및 구현 보조, 행정적 절차 지원.",
    ],
  },
  {
    id: "ex-teacher",
    period: "2026.03.09 – 2026.06.25",
    place: "부산, 대한민국",
    title: "산학겸임교사(시간제, 계약직), 모바일프로그래밍",
    org: "부산소프트웨어마이스터고등학교",
    points: [
      "3학년 학생을 대상으로 React Native 기반 모바일 앱 개발 수업을 진행하며, 앱 구조 설계와 구현 실습을 지도.",
      "앱 개발 시 고려해야 할 데이터 보안, 민감정보 처리, 통신 보안 등 개발 단계의 보안 관점을 별도 교육 과정으로 지도.",
      "SSL Pinning 등 모바일 앱 보안 기법과 개발자로서 알아야 할 보안 개념을 실습 중심으로 체득할 수 있도록 교육.",
    ],
  },
  {
    id: "ex-airforce",
    period: "2022.04.25 – 2024.01.24",
    place: "수원, 대한민국",
    title: "병837기 정보보호병",
    org: "대한민국 공군",
    points: [
      "정보보호 장비 관리, 보안 관제, 정책·차단 관리 업무를 수행하며 군 네트워크 보안 운영 경험을 축적.",
      "군 보안규정에 위배되지 않는 범위에서 정책 파일 자동 변환, 이벤트 발생 시 소리 알림 등 일부 정책 관리 및 업무 자동화 도구 개발.",
      "내부 해킹메일 훈련 및 디페이스 대응 훈련에 참여하며 실전적인 공격 대응 절차와 침해사고 대응 역량 강화.",
    ],
  },
];

export const experienceExp: TimelineItem[] = [
  {
    id: "ex-ftg",
    period: "2025.12 – 현재",
    place: "개인",
    title: "국내 대형 게임사 버그바운티 — FindTheGap",
    org: "취약점분석 · 최고 심각도: High (77점, BM 직접 영향)",
    imageLabel: "인증서",
    images: [
      {
        src: "/experience/findthegap-certification.png",
        alt: "파인더갭(FindTheGap) 버그바운티 참여자 인증서 — 정준영 / 158P",
        fit: "contain",
      },
      {
        src: "/experience/findthegap-reports.png",
        alt: "파인더갭(FindTheGap) 취약점 발견 리포트 내역 — 유효 제보 4건",
        fit: "contain",
      },
    ],
    points: [
      "Mobile(Frida 동적 분석을 통한 보안 모듈 탐지 우회) · Web(SSO Redirect URL 미검증으로 인한 인증 토큰 탈취) · API(파라미터 변조를 통한 재화 지불 우회) 등 다층적 Attack surface에서 총 5건 발견·제보.",
      "취약점별 PoC 작성, 보고서 작성, 개선방안 제시까지 모의해킹 전 프로세스 수행.",
      "AI 멀티 에이전트를 동반자적 역할로 활용한 협업형 반자동화 블랙박스 테스팅 방법론 수립 및 적용.",
      "하드코딩된 자격 증명, 파라미터 변조(2건), URL Redirect 등 유효 취약점 4건이 플랫폼에서 정식 접수·인정.",
      "유효 취약점 제보로 프로그램 보안 강화에 기여한 점을 인정받아 파인더갭(FindTheGap) 인증서 발급 — 누적 158P. (2026.08.27 · ID FvBHjiKoj3QWXhM1w4H6U)",
    ],
  },
  {
    id: "ex-yisf2020",
    period: "2020 · 수상 2020.12.30",
    place: "순천향대학교",
    title: "2020 청소년정보보호페스티벌(YISF 2020) 운영팀",
    org: "정보보호학과 · 문제 출제 및 대회 운영",
    imageLabel: "상장",
    images: [
      {
        src: "/experience/yisf-2020-merit-award.png",
        alt: "공로상(한국정보보호산업협회장상) 상장 — 2020 청소년정보보호페스티벌 운영팀",
        fit: "contain",
      },
    ],
    points: [
      "「2020 순천향대학교 청소년 정보보호 페스티벌」 운영팀에 참여해 문제 출제와 대회 운영을 담당.",
      "성공적인 대회 운영에 공헌한 바를 인정받아 운영팀 단체로 공로상(한국정보보호산업협회장상)을 수상. (2020.12.30)",
    ],
  },
  {
    id: "ex-andong2020",
    period: "2020.10.01 – 2020.11.30",
    place: "국립안동대학교 SW융합교육원",
    title: "제2회 전국 고등학생 사이버보안경진대회 운영요원",
    org: "국립안동대학교 SW융합교육원 주최 · 사이버보안센터 주관",
    imageLabel: "확인증",
    images: [
      {
        src: "/experience/andong-cyber-security-contest-2020.png",
        alt: "국립안동대학교 SW융합교육원 확인증 — 제2회 전국 고등학생 사이버보안경진대회 운영 요원",
        fit: "contain",
      },
    ],
    points: [
      "국립안동대학교 SW융합교육원이 주최하고 사이버보안센터가 주관한 「제2회 전국 고등학생 사이버보안경진대회」의 운영 요원으로 활동.",
      "약 2개월간(2020.10.01 – 2020.11.30) 대회 운영에 참여한 사실을 SW융합교육원장 명의 확인증으로 확인받음.",
    ],
  },
  {
    id: "ex-dropper",
    period: "2018.02 – 2024.03",
    place: "대한민국",
    title: "Dropper Lab",
    org: "팀장 및 설립자",
    points: [
      "2018년 2월 Team A0V3R로 팀을 설립하여 내부 CTF 개최, 정보보안 세미나 및 외부 워게임 사이트 운영을 주도.",
      "2019–2021년 Inc0gnito conference 참여 단체로 팀 부스를 운영하고 웹 보안 및 취약점 분석 관련 발표를 진행.",
      "2023년 3월 Dropper Lab으로 리브랜딩한 이후 정보보안 기술 연구에 중점을 두고 내부 성과발표회를 운영.",
    ],
  },
];

// --------------------------------------------------- Certifications (5 + 2)
export const certsQual: Cert[] = [
  { id: "ct-gisa", date: "2026.06.12 취득", expires: "영구 · 만료 없음", title: "정보처리기사", sub: "26201080428C", image: { src: "/certifications/information-processing-engineer.png", alt: "국가기술자격증 — 정보처리기사 (26201080428C)", fit: "contain" } },
  { id: "ct-hr-js", date: "2026.05.08 통과", expires: "영구 · 만료 없음", title: "HackerRank — JavaScript (Intermediate)", sub: "Award AD46F677E5EA", image: { src: "/certifications/hackerrank-javascript.png", alt: "HackerRank Certificate of Accomplishment — JavaScript (Intermediate)", fit: "contain" } },
  { id: "ct-hr-node", date: "2025.12.17 통과", expires: "영구 · 만료 없음", title: "HackerRank — Node.js (Intermediate)", sub: "Award 0FEC456A1FFF", image: { src: "/certifications/hackerrank-nodejs.png", alt: "HackerRank Certificate of Accomplishment — Node.js (Intermediate)", fit: "contain" } },
  { id: "ct-sqld", date: "2024.09.20 취득", expires: "2026.03.20 영구 전환", title: "SQL 개발자 (SQLD)", sub: "SQLD-054018954", image: { src: "/certifications/sqld.png", alt: "국가공인 자격증 — SQL 개발자 (SQLD-054018954)", fit: "contain" } },
  { id: "ct-linux", date: "2020.10.23 취득", expires: "영구 · 만료 없음", title: "리눅스 마스터 2급", sub: "LMS-2003-006649", image: { src: "/certifications/linux-master-2.png", alt: "정보통신기술자격검정 합격확인서 — 리눅스마스터 2급 (LMS-2003-006649)", fit: "contain" } },
];

export const certsEtc: Cert[] = [
  { id: "ct-claude", date: "2026.06.14 수료", expires: "영구 · 만료 없음", title: "Claude Code in Action", sub: "Award 6672EG9J6DM9", image: { src: "/certifications/claude-code-in-action.png", alt: "Anthropic Certificate of Completion — Claude Code in Action", fit: "contain" } },
  { id: "ct-googleai", date: "2025.12.03 수료", expires: "영구 · 만료 없음", title: "Google AI Essentials Specialization", sub: "Award EO3PBI26QHCK", image: { src: "/certifications/google-ai-essentials.jpg", alt: "Coursera Specialization Certificate — Google AI Essentials (5개 강좌)", fit: "contain" } },
];

// ----------------------------------------------------------- Education (9)
export const eduMain: TimelineItem[] = [
  {
    id: "ed-sch",
    period: "2020.03.03 – 2027.02.18",
    place: "아산시, 대한민국",
    title: "순천향대학교",
    org: "SW융합대학 정보보호학과",
    imageLabel: "증빙 자료",
    images: [
      {
        src: "/awards/schu-ai-sw-festival-2025.jpg",
        alt: "순천향대학교 SW중심대학사업단장 상장 — 2025 SCHU AI·SW Festival SW프로젝트 경진대회 대상 (제2025-070호)",
        fit: "contain",
      },
      {
        src: "/education/sw-frontier-4th-2025.jpg",
        alt: "순천향대학교 SW중심대학사업단 활동인증서 — 제4기 SW프런티어 (제2025-140호)",
        fit: "contain",
      },
    ],
    points: [
      "학점 4.15/4.5 · 전공 4.11/4.5 (3-2학기 기준).",
      "2025 SCHU AI & SW Festival SW 프로젝트 경진대회 프로젝트 리드 및 대상 수상.",
      "제4기 SW프런티어 활동: AI로 구직자에게 희망을 주는 HireLink 기획/개발 및 교내 해커톤 장려상 수상.",
      "2024년 초까지 SecurityFirst 동아리 Web 팀에서 활동하며 Web Hacking Playground 제작, 구성원 대상 웹 취약점 실습 교육·멘토링, 내부 기술 발표를 수행.",
    ],
  },
  {
    id: "ed-fsi",
    period: "2025.07.08 – 2025.11.07",
    place: "금융보안원",
    title: "금융보안아카데미 3기",
    org: "사이버 위협 대응·분석 분야 (feat. AI·데이터)",
    imageLabel: "증빙 자료",
    images: [
      {
        src: "/awards/fsi-academy-2025.jpg",
        alt: "금융보안원장 상장 — 금융보안아카데미 2025 최우수상 (제25-2003호)",
        fit: "contain",
      },
    ],
    points: [
      "교육 과정중 ”금붕어하겐다즈도둑”팀 리드 및 최우수상(금융보안원장상) 수상.",
      "금융보안원 레드팀 실무 멘토진으로부터 공격 시나리오 구성, 모의해킹 방법론 및 공격 기법 학습.",
      "다수 CTF에 참여하며 Web Hacking 및 AI Adversarial Attack 분야 중점 풀이.",
    ],
  },
  {
    id: "ed-bob",
    period: "2021.07.01 – 2022.03.31",
    place: "KITRI (현 KISA)",
    title: "차세대 보안리더 양성 프로그램 10기",
    org: "취약점분석 트랙",
    imageLabel: "수료증",
    images: [
      {
        src: "/education/bob-10th-2022.jpg",
        alt: "한국정보기술연구원(KITRI) 수료증 — 차세대 보안리더 양성 프로그램 BEST OF THE BEST 10기, 취약점분석 트랙 (BoB 제22-169호)",
        fit: "contain",
      },
    ],
    points: [
      "취약점분석 트랙에서 웹·시스템·리버싱 분야의 공격 기법과 취약점 분석 절차를 실습하며 모의해킹 기반 분석 역량을 강화.",
    ],
  },
];

export const eduCyberTraining: TimelineItem[] = [
  {
    id: "ed-cstc19",
    period: "2019.07.22 – 2019.07.23",
    place: "사이버안전훈련센터",
    title: "차세대 핵심보안 인력 교육훈련(중고등) 수료",
    imageLabel: "수료증",
    images: [
      {
        src: "/education/cyber-security-training-2019.png",
        alt: "2019 차세대 핵심보안 인력 교육훈련 수료증",
        fit: "contain",
      },
    ],
    points: ["16시간 교육과정 수료."],
  },
  {
    id: "ed-cstc18",
    period: "2018.08.06 – 2018.08.07",
    place: "사이버안전훈련센터",
    title: "정보보안 영재대상 교육훈련 수료",
    imageLabel: "수료증",
    images: [
      {
        src: "/education/cyber-security-training-2018.png",
        alt: "2018 정보보안 영재대상 교육훈련 수료증",
        fit: "contain",
      },
    ],
    points: ["16시간 교육과정 수료."],
  },
];

// 교육부지정 공주대학교 정보보호영재교육원 4개 연차. 갤러리는 그 해의 수료증만
// 담습니다 — 함께 받은 상장 스캔본은 Awards 섹션이 단일 출처입니다.
export const eduKeris: TimelineItem[] = [
  {
    id: "ed-keris19",
    period: "2019.03.16 – 2019.11.23",
    place: "공주대학교 정보보호영재교육원",
    title: "고등전문1 과정 수료",
    org: "교육부지정 정보보호영재교육원",
    imageLabel: "수료증",
    images: [
      { src: "/education/gifted-high-pro-1-2019.jpg", alt: "공주대학교 정보보호영재교육원 수료증 — 고등전문1 과정 (제20190082호)", fit: "contain" },
    ],
    points: [
      "교육과정 우수상 수상.",
      "2019년 모의해킹 공격/방어대회 우수상 수상.",
      "제5회 정보보안 경진대회 개인전 장려상 수상. (교육부·정보보호영재교육원협의회 주최, 한국교육학술정보원 주관)",
    ],
  },
  {
    id: "ed-keris18",
    period: "2018.03.10 – 2018.11.17",
    place: "공주대학교 정보보호영재교육원",
    title: "고등전문II 과정 수료",
    org: "교육부지정 정보보호영재교육원",
    imageLabel: "수료증",
    images: [
      { src: "/education/gifted-high-pro-2-2018.jpg", alt: "공주대학교 정보보호영재교육원 수료증 — 고등전문II 과정 (제20180085호)", fit: "contain" },
    ],
    points: [
      "교육과정 우수상 수상.",
      "제4회 정보보안 경진대회 개인전 우수상 수상. (교육부·정보보호영재교육원협의회 주최, 한국교육학술정보원 주관)",
    ],
  },
  {
    id: "ed-keris17",
    period: "2017.03.11 – 2017.11.25",
    place: "공주대학교 정보보호영재교육원",
    title: "고등기초심화A 과정 수료",
    org: "교육부지정 정보보호영재교육원",
    imageLabel: "수료증",
    images: [
      { src: "/education/gifted-high-basic-a-2017.jpg", alt: "공주대학교 정보보호영재교육원 수료증 — 고등기초심화A 과정 (제20170059호)", fit: "contain" },
    ],
    points: [
      "교육과정 우수상 수상.",
      "2017년 모의해킹 공격/방어대회 우수상 수상.",
      "프로젝트(apk로 유포되는 설치파일을 통한 기기 데이터 유출과정과 시연) 발표회 장려상 수상(Minecraft 팀).",
    ],
  },
  {
    id: "ed-keris16",
    period: "2016.03.12 – 2016.11.19",
    place: "공주대학교 정보보호영재교육원",
    title: "중등기초B 과정 수료",
    org: "교육부지정 정보보호영재교육원",
    imageLabel: "수료증",
    images: [
      { src: "/education/gifted-mid-basic-b-2016.jpg", alt: "공주대학교 정보보호영재교육원 수료증 — 중등기초B 과정 (제20160029호)", fit: "contain" },
    ],
    points: ["교육과정 최우수상 수상.", "프로젝트 발표회 장려상 수상(럭키 팀)."],
  },
];

// ------------------------------------------------------------- Awards (23)
// Every entry is transcribed from the scanned 상장 in reference/ref/수상실적.
export const awards: Award[] = [
  {
    title: "최우수상(금융보안원장, 제 25-2003호)",
    detail: "금융보안아카데미 3기 · 팀 “금붕어하겐다즈도둑”",
    date: "2025.11.07",
    images: [{ src: "/awards/fsi-academy-2025.jpg", alt: "금융보안원장 상장 — 금융보안아카데미 2025 최우수상 (제25-2003호)", fit: "contain" }],
  },
  {
    title: "대상(순천향대학교 SW중심대학사업단장, 제 2025-070호)",
    detail: "2025 SCHU AI·SW Festival SW프로젝트 경진대회 · 팀 “Stellar Stellar”",
    date: "2025.11.05",
    images: [{ src: "/awards/schu-ai-sw-festival-2025.jpg", alt: "순천향대학교 SW중심대학사업단장 상장 — 2025 SCHU AI·SW Festival SW프로젝트 경진대회 대상 (제2025-070호)", fit: "contain" }],
  },
  {
    title: "우수상(한국주택금융공사 사장, 제 2025-61호)",
    detail: "제1회 영남권 사이버공격 방어 대회(대학팀 부문) · 팀 “금붕어하겐다즈도둑”",
    date: "2025.10.15",
    images: [{ src: "/awards/yeongnam-cyber-defense-2025.jpg", alt: "한국주택금융공사 사장 상장 — 제1회 영남권 사이버 공격방어 대회 우수상 (제2025-61호)", fit: "contain" }],
  },
  {
    title: "우수상(한국보건산업진흥원장, 제 6671호)",
    detail: "2024 충청권 사이버보안 경진대회 · 팀 “가리비에 민트초코 하이볼”",
    date: "2024.09.27",
    images: [{ src: "/awards/chungcheong-cyber-security-2024.jpg", alt: "한국보건산업진흥원장 상장 — 2024 충청권 사이버보안 경진대회 우수상 (제6671호)", fit: "contain" }],
  },
  {
    title: "장려상(공군 사이버작전센터장, 제 23-7호)",
    detail: "2023 제9회 공군 사이버전사 경연대회 · 개인",
    date: "2023.06.20",
    images: [{ src: "/awards/af-cyber-warrior-9th-2023.jpg", alt: "공군 사이버작전센터장 상장 — 제9회 공군 사이버전사 경연대회 장려상 (제23-7호)", fit: "contain" }],
  },
  {
    title: "장려상(공군본부 정책실장 준장, 제 6호)",
    detail: "제4회 공군 창의·혁신 아이디어 공모 해커톤 경연대회 · 팀 “활주”",
    date: "2022.11.01",
    images: [{ src: "/awards/af-innovation-hackathon-4th-2022.jpg", alt: "공군본부 정책실장 상장 — 제4회 공군 창의·혁신 아이디어 공모 해커톤 경연대회 장려상 (제6호)", fit: "contain" }],
  },
  {
    title: "장려상(공군 사이버작전센터장, 제 4호)",
    detail: "2022 제8회 공군 사이버전사 경연대회 · 개인",
    date: "2022.07.26",
    images: [{ src: "/awards/af-cyber-warrior-8th-2022.jpg", alt: "공군 사이버작전센터장 상장 — 제8회 공군 사이버전사 경연대회 장려상 (제4호)", fit: "contain" }],
  },
  {
    title: "공로상(한국정보보호산업협회장)",
    detail: "2020 청소년정보보호페스티벌(YISF 2020) 출제 및 운영 · 단체",
    date: "2020.12.30",
    images: [{ src: "/experience/yisf-2020-merit-award.png", alt: "공로상(한국정보보호산업협회장상) 상장 — 2020 청소년정보보호페스티벌 운영팀", fit: "contain" }],
  },
  {
    title: "장려상(공주대학교 정보보호영재교육원장, 제 20194004호)",
    detail: "제5회 정보보안 경진대회 개인전 · 교육부·정보보호영재교육원협의회 주최, 한국교육학술정보원 주관",
    date: "2019.11.23",
    images: [{ src: "/awards/infosec-contest-5th-2019.jpg", alt: "공주대학교 정보보호영재교육원 표창장 — 제5회 정보보안 경진대회 개인전 장려상 (제20194004호)", fit: "contain" }],
  },
  {
    title: "우수상(공주대학교 정보보호영재교육원장, 제 20195003호)",
    detail: "2019년 모의해킹 공격/방어 대회 · 고등전문1 과정 · 개인",
    date: "2019.11.23",
    images: [{ src: "/awards/gifted-mock-hacking-2019.jpg", alt: "공주대학교 정보보호영재교육원 표창장 — 2019년 모의해킹 공격/방어 대회 우수상 (제20195003호)", fit: "contain" }],
  },
  {
    title: "우수상(공주대학교 정보보호영재교육원장, 제 20191018호)",
    detail: "고등전문1 과정 · 개인",
    date: "2019.11.23",
    images: [{ src: "/awards/gifted-attitude-2019.jpg", alt: "공주대학교 정보보호영재교육원 표창장 — 고등전문1 과정 학습태도 우수상 (제20191018호)", fit: "contain" }],
  },
  {
    title: "은상(천안청수고등학교장, 제 2019-1300호)",
    detail: "2019학년도 교내 1학생 1주제 탐구대회 · 개인 (2위)",
    date: "2019.07.17",
    images: [{ src: "/awards/student-research-silver-2019.jpg", alt: "천안청수고등학교장 상장 — 2019학년도 1학생 1주제 탐구대회 은상 (제2019-1300호)", fit: "contain" }],
  },
  {
    title: "금상(천안청수고등학교장, 제 2019-0061호)",
    detail: "2019학년도 IT컴퓨팅 콘테스트 SW개발 부문 · 개인 (1위)",
    date: "2019.04.25",
    images: [{ src: "/awards/it-computing-sw-gold-2019.jpg", alt: "천안청수고등학교장 상장 — 2019학년도 IT컴퓨팅 콘테스트 SW개발 부문 금상 (제2019-0061호)", fit: "contain" }],
  },
  {
    title: "은상(천안청수고등학교장, 제 2019-0053호)",
    detail: "2019학년도 IT컴퓨팅 콘테스트 정보검색 부문 · 개인 (2위)",
    date: "2019.04.25",
    images: [{ src: "/awards/it-computing-search-silver-2019.jpg", alt: "천안청수고등학교장 상장 — 2019학년도 IT컴퓨팅 콘테스트 정보검색 부문 은상 (제2019-0053호)", fit: "contain" }],
  },
  {
    title: "우수상(공주대학교 정보보호영재교육원장, 제 20184003호)",
    detail: "제4회 정보보안 경진대회 개인전 · 교육부·정보보호영재교육원협의회 주최, 한국교육학술정보원 주관",
    date: "2018.11.17",
    images: [{ src: "/awards/infosec-contest-4th-2018.jpg", alt: "공주대학교 정보보호영재교육원 표창장 — 제4회 정보보안 경진대회 개인전 우수상 (제20184003호)", fit: "contain" }],
  },
  {
    title: "우수상(공주대학교 정보보호영재교육원장, 제 20181017호)",
    detail: "고등전문II 과정 · 개인",
    date: "2018.11.17",
    images: [{ src: "/awards/gifted-attitude-2018.jpg", alt: "공주대학교 정보보호영재교육원 표창장 — 고등전문II 과정 학습태도 우수상 (제20181017호)", fit: "contain" }],
  },
  {
    title: "감사장(Net Impact Korea CEO)",
    detail: "Net Impact Impactathon in South Korea 기여 · 중소벤처기업부 후원",
    date: "2018.09.01",
    images: [{ src: "/awards/net-impact-impactathon-2018.jpg", alt: "Net Impact Korea Certificate of Appreciation — Net Impact Impactathon in South Korea", fit: "contain" }],
  },
  {
    title: "동상(천안청수고등학교장, 제 2018-0103호)",
    detail: "IT상상력 콘테스트 프로그래밍 부문 · 개인 (3위)",
    date: "2018.05.01",
    images: [{ src: "/awards/it-imagination-bronze-2018.jpg", alt: "천안청수고등학교장 상장 — IT상상력 콘테스트 프로그래밍 부문 동상 (제2018-0103호)", fit: "contain" }],
  },
  {
    title: "우수상(공주대학교 정보보호영재교육원장, 제 20175003호)",
    detail: "2017년 모의해킹 공격/방어 대회 · 고등기초심화A 과정 · 개인",
    date: "2017.11.25",
    images: [{ src: "/awards/gifted-mock-hacking-2017.jpg", alt: "공주대학교 정보보호영재교육원 표창장 — 2017년 모의해킹 공격/방어 대회 우수상 (제20175003호)", fit: "contain" }],
  },
  {
    title: "장려상(공주대학교 정보보호영재교육원장, 제 20172033호)",
    detail: "프로젝트 발표회 · 팀 “Minecraft” (apk 설치파일을 통한 기기 데이터 유출 과정 시연)",
    date: "2017.11.25",
    images: [{ src: "/awards/gifted-project-minecraft-2017.jpg", alt: "공주대학교 정보보호영재교육원 표창장 — 프로젝트 발표회 장려상, Minecraft 팀 (제20172033호)", fit: "contain" }],
  },
  {
    title: "우수상(공주대학교 정보보호영재교육원장, 제 20171014호)",
    detail: "고등기초심화A 과정 · 개인",
    date: "2017.11.25",
    images: [{ src: "/awards/gifted-attitude-2017.jpg", alt: "공주대학교 정보보호영재교육원 표창장 — 고등기초심화A 과정 학습태도 우수상 (제20171014호)", fit: "contain" }],
  },
  {
    title: "장려상(공주대학교 정보보호영재교육원장, 제 20162021호)",
    detail: "프로젝트 발표회 · 팀 “럭키”",
    date: "2016.11.19",
    images: [{ src: "/awards/gifted-project-lucky-2016.jpg", alt: "공주대학교 정보보호영재교육원 표창장 — 프로젝트 발표회 장려상, 럭키 팀 (제20162021호)", fit: "contain" }],
  },
  {
    title: "최우수상(공주대학교 정보보호영재교육원장, 제 20161002호)",
    detail: "중등기초B 과정 · 개인",
    date: "2016.11.19",
    images: [{ src: "/awards/gifted-attitude-2016.jpg", alt: "공주대학교 정보보호영재교육원 표창장 — 중등기초B 과정 학습태도 최우수상 (제20161002호)", fit: "contain" }],
  },
];

// --------------------------------------------------------- Publications (5)
export const publications: Publication[] = [
  {
    title: "Stellar-Agent: IaC 룰셋 및 모델 컨텍스트 프로토콜(MCP)을 통합한 AI 에이전트 기반 하이브리드 DevSecOps 정책 감사 프레임워크",
    venue: "2025 한국데이터사이언스학회 동계학술대회 논문집, 2025.12.18, 논문번호 0032, p.118 · 포스터 발표",
    authors: "정준영, 이창엽, 이정민, 이유식 (순천향대학교)",
  },
  {
    title: "브라우저 확장 프로그램을 활용한 웹 취약점 분석 방안",
    venue: "한국정보보호학회 동계학술대회 논문집 Vol. 31, No. 2, 2021.11.16, 논문번호 77, p.61 · 구두 발표",
    authors: "정준영, 구도훈, 김종민, 김주원, 이주명, 이상현, 이강석 (BoB), 최지헌 (월간해킹)",
  },
  {
    title: "Into the Maldoc: CTF와 리얼월드 바이너리 분석을 중심으로",
    venue: "Inc0gnito conference 2021, 2021.08.27 · 컨퍼런스 발표",
    authors: "정준영, 이문규, 김호연 (Dropper Lab)",
  },
  {
    title: "문서형 악성코드 분석 및 대응방안 연구",
    venue: "한국정보보호학회 동계학술대회 논문집 Vol. 30, No. 2, 2020.11.17, 논문번호 108, p.323 · 구두 발표",
    authors: "정준영, 이문규, 서정택 (순천향대학교)",
  },
  {
    title: "__proto__.pollution : 1",
    venue: "Halliance 1st Open Seminar, 2020.07.04 · 세미나 발표",
    authors: "정준영",
  },
];

// -------------------------------------------------------------- Skills
export const skills: Skill[] = [
  {
    label: "Security",
    type: "text",
    text: "Web 솔루션 / API / 모바일 애플리케이션 취약점 분석, Burp Suite · Frida · Ghidra · IDA 기반 정적·동적 분석",
  },
  {
    label: "AI/Automation",
    type: "text",
    text: "반복작업(Recon 등 초동분석) 자동화, 분석 보조 도구 개발 및 스크립트 작성, AI-Driven 블랙박스 테스팅(Semi-DAST) 환경 구성 및 적극적 활용, MCP 기반 분석 자동화",
  },
  { label: "Development", type: "tags", tags: ["Node.js", "React", "Next.js", "React Native", "Expo"] },
  { label: "Programming", type: "tags", tags: ["Javascript", "Typescript", "Python", "Java", "C", "SQL", "PHP"] },
  { label: "Databases", type: "tags", tags: ["MySQL", "MariaDB", "PostgreSQL", "Oracle RDBMS", "Redis"] },
  { label: "Languages", type: "text", text: "Korean (Native), English (Intermediate), Japanese (Intermediate)" },
];

// ------------------------------------------------------------ Activities (7)
export const activities: Activity[] = [
  {
    title: "2026 HACKSIUM BUSAN: 고급부문 예선 13등 본선 진출",
    date: "2026.08.08 · 본선 2026.09.11 – 09.12",
    team: "팀 「부산부수기너만오면고」 · 온라인 예선 / 본선 부산 영도구 피아크 아트홀",
    points: ["2026 HACKSIUM BUSAN 고급부문 온라인 예선에서 13위를 기록해 본선에 진출."],
  },
  {
    title: "NYPC 2026 MASTER TRACK: 예선 4등 본선 진출",
    date: "2026.06.29 – 07.08 · 본선 2026.08.29",
    team: "팀 「Decagrammaton」",
    imageLabel: "현장 사진",
    images: [
      {
        src: "/experience/nypc-2026-master-track.jpg",
        alt: "NYPC 2026 MASTER TRACK 본선 현장 — 팀 Decagrammaton의 참가자 명찰과 부스",
      },
    ],
    points: ["NYPC 2026 MASTER TRACK 예선에서 4위를 기록해 본선에 진출."],
  },
  { title: "2026 핵테온 세종: 고급부문 예선 13등 본선 진출", date: "2026.04.25", team: "팀 「군필 사이에 낀 미필게티」 - Web, AI 풀이 담당" },
  { title: "WHITEHAT 2025: 대학생부 예선 4등 본선 진출", date: "2025.10.18", team: "팀 「금붕어하겐다즈도둑」 - Web, AI 풀이 담당" },
  { title: "금융보안원 FIESTA 2025: 대학(원)생부문 7위 특별상", date: "2025.09.26 – 09.28", team: "팀 「금붕어하겐다즈도둑」 - Web, AI 풀이 담당" },
  { title: "Kaspersky CTF 2025: Asia·Oceania 권역 716팀 중 15등, 한국 2등", date: "2025.08.30 – 08.31", team: "팀 「Goldfish Haagen-Dazs Thieves」 - Web 풀이 담당" },
  { title: "CCE 2022: 공공부문 본선 진출", date: "2022.09.24", team: "팀 「제203항공마도대대」 - Web 풀이 담당" },
];

// -------------------------------------------------------- Nav definitions
export const overviewNav: NavItem[] = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certifications" },
  { id: "education", label: "Education" },
  { id: "awards", label: "Awards" },
  { id: "publications", label: "Publications" },
  { id: "skills", label: "Skills" },
  { id: "activities", label: "Activities" },
  { id: "contact", label: "Contact" },
];

