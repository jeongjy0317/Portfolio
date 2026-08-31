// Detail-page normalization. Every section's items are mapped into one shared
// `DetailData` shape so a single <DetailView> renders them all in the same
// style as the project detail page. Projects keep their own /project/[symbol]
// route (they carry a GitHub link); the other seven sections are served by the
// generic /detail/[section]/[symbol] route.

import {
  experienceWork,
  experienceExp,
  certsQual,
  certsEtc,
  eduMain,
  eduCyberTraining,
  eduKeris,
  awards,
  publications,
  skills,
  activities,
  type Activity,
  type Award,
  type Cert,
  type GalleryImage,
  type Publication,
  type Skill,
  type TimelineItem,
} from "./data";

export interface DetailMetaRow {
  k: string;
  v: string;
}

export interface DetailLink {
  label: string;
  href: string;
  external?: boolean;
  icon?: "github";
}

export interface DetailData {
  section: string; // "experience"
  sectionLabel: string; // eyebrow, e.g. "EXPERIENCE"
  num: string; // "02.01"
  period?: string;
  badge?: string;
  badgeStrong?: boolean;
  title: string;
  subtitle?: string;
  imageLabel?: string; // gallery heading (default "미리보기")
  images?: GalleryImage[];
  points?: string[];
  meta: DetailMetaRow[]; // sidebar 정보 rows
  links: DetailLink[]; // sidebar 관련 자료 (extra links beyond list/overview)
  backHref: string; // top back link
  backLabel: string; // e.g. "EXPERIENCE"
  listHref: string; // "모든 …" link
  listLabel: string; // "모든 경력"
}

export interface DetailNeighbor {
  href: string;
  title: string;
}

const pad = (n: number) => String(n).padStart(2, "0");
const ongoing = (p: string) => p.includes("현재");

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Href helpers shared with list/overview call sites. */
export const detailHref = (section: string, id: string) => `/detail/${section}/${id}/`;
export const awardId = (i: number) => `aw-${i + 1}`;
export const pubId = (i: number) => `pub-${i + 1}`;
export const activityId = (i: number) => `act-${i + 1}`;
export const skillId = (label: string) => slug(label);

// -------------------------------------------------------- Per-section config
interface SectionCfg {
  n: string;
  label: string; // eyebrow singular, e.g. "EXPERIENCE"
  backLabel: string; // top link, plural
  listHref: string;
  listLabel: string; // "모든 경력"
}

const CFG: Record<string, SectionCfg> = {
  experience: { n: "02", label: "EXPERIENCE", backLabel: "EXPERIENCE", listHref: "/experience/", listLabel: "모든 경력" },
  certifications: { n: "03", label: "CERTIFICATION", backLabel: "CERTIFICATIONS", listHref: "/certifications/", listLabel: "모든 자격" },
  education: { n: "04", label: "EDUCATION", backLabel: "EDUCATION", listHref: "/education/", listLabel: "모든 교육" },
  awards: { n: "05", label: "AWARD", backLabel: "AWARDS", listHref: "/awards/", listLabel: "모든 수상" },
  publications: { n: "06", label: "PUBLICATION", backLabel: "PUBLICATIONS", listHref: "/publications/", listLabel: "모든 논문" },
  skills: { n: "07", label: "SKILL", backLabel: "SKILLS", listHref: "/skills/", listLabel: "모든 스킬" },
  activities: { n: "08", label: "ACTIVITY", backLabel: "ACTIVITIES", listHref: "/activities/", listLabel: "모든 활동" },
};

const base = (section: string, idx: number): Pick<DetailData, "section" | "sectionLabel" | "num" | "backHref" | "backLabel" | "listHref" | "listLabel" | "links"> => {
  const c = CFG[section];
  return {
    section,
    sectionLabel: c.label,
    num: `${c.n}.${pad(idx + 1)}`,
    backHref: c.listHref,
    backLabel: c.backLabel,
    listHref: c.listHref,
    listLabel: c.listLabel,
    links: [],
  };
};

// ------------------------------------------------------------- Normalizers
function timelineDetail(section: string, item: TimelineItem, idx: number): DetailData {
  const meta: DetailMetaRow[] = [{ k: "기간", v: item.period }];
  if (item.place) meta.push({ k: "위치", v: item.place });
  if (item.org) meta.push({ k: "소속", v: item.org });
  const status = ongoing(item.period);
  return {
    ...base(section, idx),
    period: item.period,
    badge: status ? "진행 중" : "완료",
    badgeStrong: status,
    title: item.title,
    subtitle: item.org ?? undefined,
    imageLabel: item.imageLabel,
    images: item.images,
    points: item.points,
    meta,
  };
}

function certDetail(item: Cert, idx: number): DetailData {
  return {
    ...base("certifications", idx),
    badge: item.expires.includes("영구") ? "영구" : "유효",
    badgeStrong: false,
    title: item.title,
    subtitle: item.sub,
    imageLabel: "증빙 자료",
    images: item.image ? [item.image] : [],
    meta: [
      { k: "일자", v: item.date },
      { k: "유효기간", v: item.expires },
      { k: "식별번호", v: item.sub },
    ],
  };
}

function awardDetail(item: Award, idx: number): DetailData {
  const prize = item.title.split("(")[0].trim();
  const authMatch = item.title.match(/\(([^)]*)\)/);
  const authority = authMatch ? authMatch[1].split(",")[0].trim() : null;
  const meta: DetailMetaRow[] = [{ k: "수상일", v: item.date }];
  if (authority) meta.push({ k: "수여", v: authority });
  return {
    ...base("awards", idx),
    period: item.date,
    badge: prize,
    badgeStrong: true,
    title: item.detail,
    subtitle: authority ? `${authority} 수여` : undefined,
    imageLabel: item.imageLabel ?? "증빙 자료",
    images: item.images ?? [],
    meta,
  };
}

function pubDetail(item: Publication, idx: number): DetailData {
  return {
    ...base("publications", idx),
    badge: "논문",
    badgeStrong: false,
    title: item.title,
    subtitle: item.venue,
    meta: [
      { k: "게재", v: item.venue },
      { k: "저자", v: item.authors },
    ],
  };
}

function skillDetail(item: Skill, idx: number): DetailData {
  const body = item.type === "text" ? item.text : item.tags.join(" · ");
  return {
    ...base("skills", idx),
    badge: item.type === "tags" ? "기술 스택" : "역량",
    badgeStrong: false,
    title: item.label,
    subtitle: body,
    points: item.type === "tags" ? item.tags : undefined,
    meta: [{ k: "분류", v: item.type === "tags" ? "기술 스택" : "역량" }],
  };
}

function activityDetail(item: Activity, idx: number): DetailData {
  return {
    ...base("activities", idx),
    period: item.date,
    title: item.title,
    subtitle: item.team,
    imageLabel: item.imageLabel,
    images: item.images,
    points: item.points,
    meta: [
      { k: "일자", v: item.date },
      { k: "참여", v: item.team },
    ],
  };
}

// ------------------------------------------------- Ordered per-section registry
interface Entry {
  id: string;
  data: DetailData;
}

function buildSection(section: string): Entry[] {
  switch (section) {
    case "experience":
      return [...experienceWork, ...experienceExp].map((e, i) => ({ id: e.id, data: timelineDetail("experience", e, i) }));
    case "certifications":
      return [...certsQual, ...certsEtc].map((c, i) => ({ id: c.id, data: certDetail(c, i) }));
    case "education":
      return [...eduMain, ...eduCyberTraining, ...eduKeris].map((e, i) => ({ id: e.id, data: timelineDetail("education", e, i) }));
    case "awards":
      return awards.map((a, i) => ({ id: awardId(i), data: awardDetail(a, i) }));
    case "publications":
      return publications.map((p, i) => ({ id: pubId(i), data: pubDetail(p, i) }));
    case "skills":
      return skills.map((s, i) => ({ id: skillId(s.label), data: skillDetail(s, i) }));
    case "activities":
      return activities.map((a, i) => ({ id: activityId(i), data: activityDetail(a, i) }));
    default:
      return [];
  }
}

/** Route resolver: data + prev/next neighbours for a section item. */
export function getSectionDetail(
  section: string,
  id: string,
): { data: DetailData; prev: DetailNeighbor | null; next: DetailNeighbor | null } | null {
  if (!CFG[section]) return null;
  const entries = buildSection(section);
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const neighbor = (e: Entry | undefined): DetailNeighbor | null =>
    e ? { href: detailHref(section, e.id), title: e.data.title } : null;
  return {
    data: entries[idx].data,
    prev: neighbor(entries[idx - 1]),
    next: neighbor(entries[idx + 1]),
  };
}

/** generateStaticParams for the generic route — every non-project section item. */
export function sectionDetailParams(): { section: string; symbol: string }[] {
  return Object.keys(CFG).flatMap((section) => buildSection(section).map((e) => ({ section, symbol: e.id })));
}
