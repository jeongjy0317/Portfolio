import type { ReactNode } from "react";
import Link from "next/link";
import type { Activity, Award, Cert, GalleryImage, Project, Publication, Skill, TimelineItem } from "../data";
import { ImageSlot, ImageGallery, ImageGrid } from "./ImageSlot";

/* ============================================================ Primitives */

export const Divider = () => <div className="h-0.5 bg-line" />;

/** Diagonal arrow pointing to the upper-right — the "open detail" affordance. */
export function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

/**
 * Title content that becomes a detail-page link when `href` is set — an inline
 * link with the diagonal arrow affordance, sized relative to the heading. Drop
 * it inside the existing heading element so the semantics/typography stay put.
 */
export function TitleLink({ href, children }: { href?: string; children: ReactNode }) {
  if (!href) return <>{children}</>;
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-inherit no-underline transition-colors hover:text-mute-600"
    >
      {children}
      <ArrowUpRight className="h-[0.72em] w-[0.72em] shrink-0 text-mute-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mute-600" />
    </Link>
  );
}

const SectionNum = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-bold tracking-[.14em] text-mute-500">{children}</span>
);

export function SectionHead({
  n,
  title,
  titleClass = "text-[26px] md:text-[34px]",
  pbClass = "pb-11",
}: {
  n: string;
  title: string;
  titleClass?: string;
  pbClass?: string;
}) {
  return (
    <div className={`flex items-baseline gap-4 pt-4 ${pbClass}`}>
      <SectionNum>{n}</SectionNum>
      <h2 className={`m-0 ${titleClass} tracking-[-.02em] text-ink`}>{title}</h2>
    </div>
  );
}

export function DetailHeader({ n, title, count }: { n: string; title: string; count?: string }) {
  return (
    <>
      <a href="/" className="inline-block pb-12 text-[10px] font-bold tracking-[.16em] uppercase text-mute-600 no-underline">
        ← Overview
      </a>
      <div className="flex items-baseline gap-4 pb-4">
        <SectionNum>{n}</SectionNum>
        <h1 className="m-0 text-[32px] tracking-[-.03em] text-ink md:text-[48px]">{title}</h1>
        {count && <span className="ml-auto text-[12px] font-semibold text-mute-600">{count}</span>}
      </div>
      <Divider />
    </>
  );
}

/**
 * Heading for a run of related articles (e.g. the four KERIS courses). It has
 * to outrank the `GalleryArticle`/`CertArticle` titles it introduces, so it is
 * a real <h2> knocked out of an ink block and trailed by a rule that runs out
 * to the `count` — marks no article carries, so the group boundary reads at a
 * glance even though the heading sits close to the items it owns.
 */
export function GroupLabel({
  children,
  count,
  rule = true,
  titleClass = "text-[24px] md:text-[30px]",
  className = "pt-16 pb-1",
}: {
  children: ReactNode;
  count?: ReactNode;
  /** Drop the trailing rule where the heading needs to stay bare. */
  rule?: boolean;
  titleClass?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-5">
        <h2 className={`m-0 ${titleClass} bg-ink px-3.5 py-1.5 leading-[1.2] tracking-[-.02em] break-keep text-surface`}>{children}</h2>
        {rule && <div className="h-0.5 min-w-8 flex-1 bg-line" />}
        {count && (
          <span className="shrink-0 text-[11px] font-bold tracking-[.14em] uppercase text-mute-500">{count}</span>
        )}
      </div>
    </div>
  );
}

export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="mt-7 inline-flex items-center gap-2 border-b-2 border-line py-3 text-[13px] font-bold tracking-[.01em] text-mute-700 no-underline"
    >
      {children}
    </a>
  );
}

/** Two-line acquired / expires block used by every certification layout. */
export function CertDates({ date, expires, align = "right" }: { date: string; expires: string; align?: "left" | "right" }) {
  return (
    <div className={`flex flex-col gap-1 whitespace-nowrap ${align === "right" ? "text-right" : "text-left"}`}>
      <span className="text-[13px] font-bold tracking-[.04em] text-mute-700">{date}</span>
      <span className="text-[12px] font-semibold tracking-[.02em] text-mute-500">{expires}</span>
    </div>
  );
}

/* ================================================================ Blocks */

export function ProjectCard({ project, last = false }: { project: Project; last?: boolean }) {
  return (
    <Link
      href={`/project/${project.id}/`}
      className={`group block border-t border-mute-300 pt-10 pb-7 no-underline ${last ? "border-b" : ""}`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="m-0 flex items-center gap-2 text-[21px] text-ink transition-colors group-hover:text-mute-600">
          {project.title}
          <ArrowUpRight className="h-[15px] w-[15px] text-mute-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mute-600" />
        </h3>
        <span className="whitespace-nowrap text-[12px] font-semibold text-mute-600">{project.period}</span>
      </div>
      <div className="mt-2.5 text-[12px] text-mute-700">{project.subtitle} · {project.tag}</div>
      <ul className="mt-1.5 list-disc pl-[18px] text-[14px] leading-[1.65] text-mute-800">
        {project.points.map((pt, i) => <li key={i}>{pt}</li>)}
      </ul>
    </Link>
  );
}

/** Date column + content row used by Experience & Education. */
export function TimelineRow({ item, showPlace = true, last = false, href }: { item: TimelineItem; showPlace?: boolean; last?: boolean; href?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-2 border-t border-mute-300 pt-10 pb-7 md:grid-cols-[150px_1fr] md:gap-7 ${last ? "border-b" : ""}`}>
      <div className="text-[12px] font-semibold text-mute-600">
        {item.period}
        {showPlace && item.place && <span className="pl-2 font-normal md:block md:pl-0 md:pt-1">{item.place}</span>}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="m-0 text-[19px] text-ink"><TitleLink href={href}>{item.title}</TitleLink></h3>
        {item.org && <div className="text-[13px] font-semibold text-mute-700">{item.org}</div>}
        <ul className="mt-0.5 list-disc pl-[18px] text-[14px] leading-[1.65] text-mute-800">
          {item.points.map((pt, i) => <li key={i}>{pt}</li>)}
        </ul>
      </div>
    </div>
  );
}

/** Certification row: content left, dates right — compact hairline row. */
export function CertRow({ cert, last = false, href }: { cert: Cert; last?: boolean; href?: string }) {
  return (
    <div className={`grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-0.5 border-t border-mute-300 py-4 ${last ? "border-b" : ""}`}>
      <h3 className="m-0 text-[17px] leading-[1.35] text-ink"><TitleLink href={href}>{cert.title}</TitleLink></h3>
      <span className="whitespace-nowrap text-[12px] font-bold tracking-[.04em] text-mute-700">{cert.date}</span>
      <p className="m-0 text-[11.5px] text-mute-500">{cert.sub}</p>
      <span className="whitespace-nowrap text-right text-[11.5px] font-semibold tracking-[.02em] text-mute-500">{cert.expires}</span>
    </div>
  );
}

export function ActivityCard({ activity, last = false, href }: { activity: Activity; last?: boolean; href?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 border-t border-mute-300 pt-10 pb-4 ${last ? "border-b" : ""}`}>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="m-0 text-[18px] text-ink"><TitleLink href={href}>{activity.title}</TitleLink></h3>
        <span className="whitespace-nowrap text-[12px] font-semibold text-mute-600">{activity.date}</span>
      </div>
      <p className="m-0 text-[13px] text-mute-700">{activity.team}</p>
    </div>
  );
}

export function PublicationItem({ pub, last = false, href }: { pub: Publication; last?: boolean; href?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 border-t border-mute-300 pt-10 pb-4 ${last ? "border-b" : ""}`}>
      <div className="text-[15px] font-semibold leading-[1.4] text-ink"><TitleLink href={href}>{pub.title}</TitleLink></div>
      <div className="text-[12px] text-mute-700">{pub.venue}</div>
      <div className="text-[12px] text-mute-800">{pub.authors}</div>
    </div>
  );
}

export function SkillRow({ skill, last = false, href }: { skill: Skill; last?: boolean; href?: string }) {
  return (
    <div className={`grid grid-cols-1 items-start gap-2 border-t border-mute-300 pt-10 pb-4 md:grid-cols-[150px_1fr] md:gap-7 ${last ? "border-b" : ""}`}>
      <div className="text-[12px] font-bold tracking-[.1em] uppercase text-mute-600"><TitleLink href={href}>{skill.label}</TitleLink></div>
      {skill.type === "text" ? (
        <p className="m-0 text-[14px] leading-[1.7] text-mute-800">{skill.text}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skill.tags.map((t) => (
            <span key={t} className="inline-flex items-center rounded-full border border-mute-300 bg-tag px-[13px] py-2 text-[12px] font-semibold leading-none text-mute-800">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function AwardRow({ award, last = false, href }: { award: Award; last?: boolean; href?: string }) {
  return (
    <div className={`grid grid-cols-[1fr_auto] items-baseline gap-4 border-t border-mute-300 pt-10 pb-3.5 ${last ? "border-b" : ""}`}>
      <div>
        <div className="text-[14px] font-bold text-ink"><TitleLink href={href}>{award.title}</TitleLink></div>
        <div className="mt-0.5 text-[12px] text-mute-700">{award.detail}</div>
      </div>
      <span className="whitespace-nowrap text-[12px] font-semibold text-mute-600">{award.date}</span>
    </div>
  );
}

/** Detail-page award article: date + title + note left, 상장 scan right. */
export function AwardArticle({ award, last = false, href }: { award: Award; last?: boolean; href?: string }) {
  return (
    <article className={`grid grid-cols-1 items-start gap-6 border-t border-mute-300 pt-10 pb-7 md:grid-cols-[1fr_240px] md:gap-11 ${last ? "border-b" : ""}`}>
      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-bold tracking-[.12em] uppercase text-mute-600">{award.date}</div>
        <h2 className="m-0 text-[20px] leading-[1.35] text-ink"><TitleLink href={href}>{award.title}</TitleLink></h2>
        <p className="m-0 text-[13px] text-mute-700">{award.detail}</p>
      </div>
      <div className="aspect-[3/2] w-full max-w-[240px]">
        <ImageSlot image={award.images?.[0]} placeholder="수상 이미지" />
      </div>
    </article>
  );
}

/* ---- Detail-page article shapes (with image galleries) ---- */

interface GalleryItem {
  period: string;
  place?: string | null;
  tag?: string;
  title: string;
  subtitle?: string;
  org?: string | null;
  images?: GalleryImage[];
  points?: string[];
}

export function GalleryArticle({
  item,
  titleClass = "text-[30px]",
  padClass = "py-11",
  gallery = "slider",
  headingAs: Heading = "h2",
  hideOrg = false,
  href,
}: {
  item: GalleryItem;
  titleClass?: string;
  padClass?: string;
  gallery?: "slider" | "grid";
  /** Demote to h3 under a `GroupLabel`, which owns the h2 for the run. */
  headingAs?: "h2" | "h3";
  /** Drop the institution when the enclosing `GroupLabel` already names it. */
  hideOrg?: boolean;
  /** When set, the title links to a detail page and a "자세히 보기" link is shown. */
  href?: string;
}) {
  const meta = [item.period, hideOrg ? null : item.place || item.tag].filter(Boolean).join(" · ");
  const subtitle = item.subtitle || (hideOrg ? null : item.org);
  return (
    <article className={`flex flex-col gap-4 border-b border-mute-300 ${padClass}`}>
      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-bold tracking-[.12em] uppercase text-mute-600">{meta}</div>
        {/* Title + subtitle sit tight as one unit; the wider gap-2 separates them from the eyebrow. */}
        <div className="flex flex-col gap-1">
          {href ? (
            <Link href={href} className="group inline-flex items-center gap-2.5 no-underline">
              <Heading className={`m-0 ${titleClass} leading-[1.2] tracking-[-.02em] text-ink transition-colors group-hover:text-mute-600`}>
                {item.title}
              </Heading>
              <ArrowUpRight className="h-[18px] w-[18px] shrink-0 text-mute-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mute-600" />
            </Link>
          ) : (
            <Heading className={`m-0 ${titleClass} leading-[1.2] tracking-[-.02em] text-ink`}>{item.title}</Heading>
          )}
          {subtitle && <div className={`text-[14px] ${item.org ? "font-semibold" : "font-normal"} text-mute-700`}>{subtitle}</div>}
        </div>
      </div>
      {item.images &&
        (gallery === "grid" ? <ImageGrid images={item.images} /> : <ImageGallery images={item.images} />)}
      {item.points && (
        <ul className="m-0 max-w-[70ch] list-disc pl-[18px] text-[14px] leading-[1.7] text-mute-800">
          {item.points.map((pt, i) => <li key={i}>{pt}</li>)}
        </ul>
      )}
      {href && (
        <Link
          href={href}
          className="group mt-1 inline-flex items-center gap-2 text-[13px] font-bold tracking-[.01em] text-mute-700 no-underline hover:text-ink"
        >
          자세히 보기
          <ArrowUpRight className="h-[13px] w-[13px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </article>
  );
}

/** Detail-page certification article: content left, dates + image right. */
export function CertArticle({
  cert,
  last = false,
  headingAs: Heading = "h2",
  href,
}: {
  cert: Cert;
  last?: boolean;
  /** Demote to h3 under a `GroupLabel`, which owns the h2 for the run. */
  headingAs?: "h2" | "h3";
  href?: string;
}) {
  return (
    <article className={`grid grid-cols-1 items-start gap-6 border-t border-mute-300 pt-10 pb-7 md:grid-cols-[1fr_240px] md:gap-11 ${last ? "border-b" : ""}`}>
      <div className="flex flex-col gap-2">
        <Heading className="m-0 text-[22px] text-ink md:text-[24px]"><TitleLink href={href}>{cert.title}</TitleLink></Heading>
        <p className="m-0 text-[13px] text-mute-700">{cert.sub}</p>
      </div>
      <div className="flex w-full max-w-[240px] flex-col gap-3">
        <CertDates date={cert.date} expires={cert.expires} />
        <div className="aspect-[3/2] w-full">
          <ImageSlot image={cert.image} placeholder={cert.ph} />
        </div>
      </div>
    </article>
  );
}

export { ImageSlot, ImageGallery, ImageGrid } from "./ImageSlot";
