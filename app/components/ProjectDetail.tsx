"use client";

import type { Project } from "../data";
import type { DetailData, DetailNeighbor } from "../detail";
import DetailView from "./DetailView";

/** Minimal neighbour shape for prev/next navigation. */
export interface ProjectLink {
  id: string;
  title: string;
}

/**
 * Project detail view (`/project/[symbol]`). Builds a normalized `DetailData`
 * from a project — including the optional GitHub link — and hands it to the
 * shared <DetailView>, so projects read identically to every other section.
 */
export default function ProjectDetail({
  project,
  index,
  prev,
  next,
}: {
  project: Project;
  index: number; // 1-based position within the Projects section
  total: number;
  prev: ProjectLink | null;
  next: ProjectLink | null;
}) {
  const status = project.period.includes("현재");
  const data: DetailData = {
    section: "projects",
    sectionLabel: "PROJECT",
    num: `01.${String(index).padStart(2, "0")}`,
    period: project.period,
    badge: status ? "진행 중" : "완료",
    badgeStrong: status,
    title: project.title,
    subtitle: project.subtitle,
    images: project.images,
    points: project.points,
    meta: [
      { k: "기간", v: project.period },
      { k: "유형", v: project.tag },
      { k: "상태", v: status ? "진행 중" : "완료" },
    ],
    links: project.githubHref
      ? [{ label: "GitHub", href: project.githubHref, external: true, icon: "github" }]
      : [],
    backHref: "/projects/",
    backLabel: "PROJECTS",
    listHref: "/projects/",
    listLabel: "모든 프로젝트",
  };

  const neighbor = (p: ProjectLink | null): DetailNeighbor | null =>
    p ? { href: `/project/${p.id}/`, title: p.title } : null;

  return <DetailView data={data} prev={neighbor(prev)} next={neighbor(next)} />;
}
