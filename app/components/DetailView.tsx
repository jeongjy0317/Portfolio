"use client";

import Link from "next/link";
import type { DetailData, DetailNeighbor } from "../detail";
import { ImageGallery } from "./ImageSlot";
import { ArrowUpRight, AuthorLine } from "./ui";
import SwapIn from "./SwapIn";
import { Reveal, Stagger, StaggerItem } from "./motion";

/** GitHub mark. */
function GithubMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.02 11.02 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  );
}

const relLinkCls =
  "group flex items-center justify-between border-b border-mute-300 py-4 text-[13px] font-semibold text-ink no-underline hover:text-mute-600";
const relArrowCls =
  "h-[14px] w-[14px] text-mute-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mute-600";

/**
 * Shared detail view for every section. Two-column at desktop: a wide main
 * story on the left and a sticky 정보 · 관련 자료 rail on the right, with
 * prev/next navigation. Fed a normalized `DetailData` (see app/detail.ts);
 * the project detail page builds one too so all sections read identically.
 */
export default function DetailView({
  data,
  prev,
  next,
}: {
  data: DetailData;
  prev: DetailNeighbor | null;
  next: DetailNeighbor | null;
}) {
  const hasHeaderRow = !!(data.period || data.badge);

  return (
    <div className="min-h-screen bg-paper">
      <main className="mx-auto max-w-[1100px] px-5 pt-16 pb-40 md:px-14">
        <SwapIn>
          <Link
            href={data.backHref}
            className="inline-block pb-12 text-[10px] font-bold tracking-[.16em] uppercase text-mute-600 no-underline hover:text-ink"
          >
            ← {data.backLabel}
          </Link>

          <div className="grid grid-cols-1 gap-14 md:grid-cols-[1fr_300px] md:gap-16">
            {/* ---------------------------------------------------- Main */}
            <article className="min-w-0">
              <Reveal>
                <div className="flex items-center gap-3 text-[13px] font-bold tracking-[.16em] uppercase text-mute-600">
                  <span>{data.num}</span>
                  <span className="text-mute-400">·</span>
                  <span>{data.sectionLabel}</span>
                </div>
              </Reveal>

              {hasHeaderRow && (
                <Reveal delay={0.06}>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {data.period && (
                      <span className="text-[13px] font-semibold tracking-[.02em] text-mute-600">{data.period}</span>
                    )}
                    {data.badge && (
                      <span
                        className={`inline-flex items-center rounded-[4px] border px-2 py-0.5 text-[11px] font-bold tracking-[.06em] ${
                          data.badgeStrong ? "border-ink text-ink" : "border-mute-400 text-mute-600"
                        }`}
                      >
                        {data.badge}
                      </span>
                    )}
                  </div>
                </Reveal>
              )}

              <Reveal delay={0.12}>
                <h1 className="m-0 mt-5 text-[30px] leading-[1.12] tracking-[-.03em] text-ink md:text-[42px]">
                  {data.title}
                </h1>
              </Reveal>

              {data.subtitle && (
                <Reveal delay={0.18}>
                  <p className="m-0 mt-4 max-w-[58ch] text-[15px] leading-[1.6] text-mute-700 md:text-[16px]">
                    {data.subtitle}
                  </p>
                </Reveal>
              )}

              <Reveal delay={0.24}>
                <div className="mt-10 h-0.5 bg-line" />
              </Reveal>

              {/* Gallery */}
              {data.images && data.images.length > 0 && (
                <Reveal delay={0.3}>
                  <div className="mt-10">
                    <div className="pb-4 text-[10px] font-bold tracking-[.16em] uppercase text-mute-600">
                      {data.imageLabel ?? "미리보기"}
                    </div>
                    <ImageGallery images={data.images} />
                  </div>
                </Reveal>
              )}

              {/* Highlights */}
              {data.points && data.points.length > 0 && (
                <div className="mt-14">
                  <div className="pb-5 text-[10px] font-bold tracking-[.16em] uppercase text-mute-600">주요 내용</div>
                  <Stagger className="flex flex-col">
                    {data.points.map((pt, i) => (
                      <StaggerItem key={i}>
                        <div className="flex gap-4 border-t border-mute-300 py-5">
                          <span className="shrink-0 text-[12px] font-bold tracking-[.06em] text-mute-500">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <p className="m-0 max-w-[64ch] text-[14px] leading-[1.75] text-mute-800 md:text-[15px]">{pt}</p>
                        </div>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              )}
            </article>

            {/* ------------------------------------------------- Sidebar */}
            <aside className="flex flex-col gap-10 md:sticky md:top-24 md:self-start">
              {data.meta.length > 0 && (
                <Reveal delay={0.2}>
                  <div>
                    <div className="border-b border-line pb-3 text-[10px] font-bold tracking-[.16em] uppercase text-mute-600">
                      정보
                    </div>
                    <dl className="m-0 flex flex-col">
                      {data.meta.map((row) => (
                        <div key={row.k} className="flex flex-col gap-1 border-b border-mute-300 py-4">
                          <dt className="text-[10px] font-bold tracking-[.14em] uppercase text-mute-500">{row.k}</dt>
                          <dd className="m-0 text-[13px] leading-[1.55] text-mute-800">
                            {row.k === "저자" ? <AuthorLine authors={row.v} /> : row.v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </Reveal>
              )}

              <Reveal delay={0.28}>
                <div>
                  <div className="border-b border-line pb-3 text-[10px] font-bold tracking-[.16em] uppercase text-mute-600">
                    관련 자료
                  </div>
                  <div className="flex flex-col">
                    {data.links.map((l) =>
                      l.external ? (
                        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={relLinkCls}>
                          <span className="flex items-center gap-2">
                            {l.icon === "github" && <GithubMark className="h-[15px] w-[15px]" />}
                            {l.label}
                          </span>
                          <ArrowUpRight className={relArrowCls} />
                        </a>
                      ) : (
                        <Link key={l.label} href={l.href} className={relLinkCls}>
                          <span className="flex items-center gap-2">{l.label}</span>
                          <ArrowUpRight className={relArrowCls} />
                        </Link>
                      ),
                    )}
                    <Link href={data.listHref} className={relLinkCls}>
                      {data.listLabel}
                      <ArrowUpRight className={relArrowCls} />
                    </Link>
                    <Link href={`/#${data.section}`} className={relLinkCls}>
                      개요에서 보기
                      <ArrowUpRight className={relArrowCls} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </aside>
          </div>

          {/* ---------------------------------------------- Prev / Next */}
          {(prev || next) && (
            <nav className="mt-24 grid grid-cols-2 gap-6 border-t border-line pt-8" aria-label="항목 이동">
              <div>
                {prev && (
                  <Link href={prev.href} className="group flex flex-col gap-2 no-underline">
                    <span className="text-[10px] font-bold tracking-[.16em] uppercase text-mute-600">← 이전</span>
                    <span className="text-[15px] font-semibold leading-[1.4] text-ink group-hover:text-mute-600 md:text-[17px]">
                      {prev.title}
                    </span>
                  </Link>
                )}
              </div>
              <div className="text-right">
                {next && (
                  <Link href={next.href} className="group flex flex-col items-end gap-2 no-underline">
                    <span className="text-[10px] font-bold tracking-[.16em] uppercase text-mute-600">다음 →</span>
                    <span className="text-[15px] font-semibold leading-[1.4] text-ink group-hover:text-mute-600 md:text-[17px]">
                      {next.title}
                    </span>
                  </Link>
                )}
              </div>
            </nav>
          )}
        </SwapIn>
      </main>
    </div>
  );
}
