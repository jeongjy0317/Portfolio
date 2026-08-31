"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SideNav from "./components/SideNav";
import HeroName from "./components/HeroName";
import SwapIn from "./components/SwapIn";
import About from "./components/About";
import ResumeFab from "./components/ResumeFab";
import ScrollCue from "./components/ScrollCue";
import { Stagger, StaggerItem, Reveal } from "./components/motion";
import {
  Divider,
  SectionHead,
  EntryRow,
  ProjectRow,
  TimelineRow,
  CertRow,
  AwardRow,
  AwardArticle,
  PublicationRow,
  SkillRow,
  ActivityRow,
  GalleryArticle,
} from "./components/ui";
import {
  profile,
  projects,
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
  overviewNav,
} from "./data";
import { detailHref, awardId, pubId, activityId, skillId } from "./detail";

const MORE_MAX = 5;

const moreCls =
  "mt-7 inline-flex cursor-pointer items-center gap-2 border-0 border-b-2 border-line bg-transparent p-0 py-3 text-[13px] font-bold tracking-[.01em] text-mute-700";

// Scrolling content column: right-pinned at awkward widths (mirrors the left
// nav's left-14) and re-centered only on very wide (2xl) screens. The hero
// opts out of this and always stays viewport-centered.
const CONTENT_COL = "px-5 md:ml-auto md:mr-14 md:max-w-[780px] md:px-6 2xl:mx-auto";

// Shared-element morph timing for the section title (big center → header slot).
const MORPH = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

// Sections that expand into an in-page detail view.
type DetailId = "projects" | "experience" | "education" | "awards";
const DETAIL_META: Record<DetailId, { n: string; title: string }> = {
  projects: { n: "01", title: "Projects" },
  experience: { n: "02", title: "Experience" },
  education: { n: "04", title: "Education" },
  awards: { n: "05", title: "Awards" },
};

function DetailItems({ id }: { id: DetailId }) {
  if (id === "projects") {
    return (
      <>
        {projects.map((p) => (
          <StaggerItem key={p.id}><GalleryArticle item={p} titleClass="text-[26px] md:text-[28px]" href={`/project/${p.id}/`} /></StaggerItem>
        ))}
      </>
    );
  }
  if (id === "experience") {
    const all = [...experienceWork, ...experienceExp];
    return (
      <>
        {all.map((e) => (
          <StaggerItem key={e.id}><GalleryArticle item={e} titleClass="text-[26px] md:text-[28px]" href={detailHref("experience", e.id)} /></StaggerItem>
        ))}
      </>
    );
  }
  if (id === "education") {
    const all = [...eduMain, ...eduCyberTraining, ...eduKeris];
    return (
      <>
        {all.map((e) => (
          <StaggerItem key={e.id}><GalleryArticle item={e} titleClass="text-[26px] md:text-[28px]" href={detailHref("education", e.id)} /></StaggerItem>
        ))}
      </>
    );
  }
  return (
    <>
      {awards.map((a, i) => (
        <StaggerItem key={i}>
          <AwardArticle award={a} last={i === awards.length - 1} href={detailHref("awards", awardId(i))} />
        </StaggerItem>
      ))}
    </>
  );
}

export default function Overview() {
  const [detail, setDetail] = useState<DetailId | null>(null);
  // Detail entry animation: "intro" shows the big centered title, then it morphs
  // up into the header and the rest reveals ("full").
  const [phase, setPhase] = useState<"intro" | "full">("full");
  const certList = [...certsQual, ...certsEtc];

  const savedScroll = useRef(0);
  const prevDetail = useRef<DetailId | null>(null);

  const open = (id: DetailId) => {
    savedScroll.current = window.scrollY; // remember where we were in the overview
    setPhase("intro"); // batched with setDetail → first detail render is the intro
    setDetail(id);
  };
  const close = () => setDetail(null);

  // Let the big centered title finish growing in (~0.6s) and rest a beat, then
  // morph it up into the header.
  useEffect(() => {
    if (!detail) return;
    const t = setTimeout(() => setPhase("full"), 950);
    return () => clearTimeout(t);
  }, [detail]);

  const [busy, setBusy] = useState(false);

  // Build the résumé with PDFKit and hand it straight to the browser — no print
  // dialog, no rasterisation. See app/lib/resume-pdf.ts; the module (and the
  // ~1MB PDFKit bundle) is only fetched on the first click.
  const downloadResume = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { downloadResumePdf } = await import("./lib/resume-pdf");
      await downloadResumePdf();
    } catch (err) {
      console.error("이력서 PDF 생성 실패", err);
      alert("이력서 PDF를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  };

  // Adjust scroll AFTER the new view has rendered (Safari ignores a scrollTo
  // fired synchronously before the layout changes).
  useEffect(() => {
    if (detail) {
      window.scrollTo(0, 0); // detail starts at the top
    } else if (prevDetail.current) {
      window.scrollTo(0, savedScroll.current); // back → restore overview position
    }
    prevDetail.current = detail;
  }, [detail]);

  return (
    <>
    <div className="min-h-screen bg-paper">
      <SideNav
        items={overviewNav}
        base={13}
        activeScale={1.5}
        detail={detail ? { id: detail, label: DETAIL_META[detail].title, onBack: close } : null}
      />

      {/* main only owns the vertical rhythm now; horizontal placement lives on
          the columns below — the hero is always viewport-centered, while the
          scrolling sections and the detail view pin right at awkward widths. */}
      <main className={`pt-24 pb-40 md:pb-[220px] ${detail ? "max-md:pt-16 md:pt-28" : "md:pt-0"}`}>
        {detail ? (
          phase === "intro" ? (
            // Phase 1 — the section title appears BIG, dead-center in the
            // viewport, everything else hidden behind a clean paper wash.
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-paper px-6">
              <motion.h2
                layoutId="detail-title"
                initial={{ scale: 0.35, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={MORPH}
                className="m-0 text-center text-[16vw] tracking-[-.02em] text-ink md:text-[120px]"
              >
                {DETAIL_META[detail].title}
              </motion.h2>
            </div>
          ) : (
            // Phase 2 — the SAME title has flown UP into the section header
            // (layoutId morph); the chrome fades and the items stagger in after.
            <div className={`flex flex-col ${CONTENT_COL}`}>
              {/* Desktop only: rule above the big numbered title (mobile puts the
                  back+title inline right under the name instead). */}
              <motion.div className="hidden md:block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.4 }}>
                <Divider />
              </motion.div>
              {/* Header. Mobile: a normal-flow "← Title" sitting just below the
                  name, left-aligned to the content padding; z-20 keeps it above
                  the top paper-wash. Desktop: the numbered big title. One
                  layoutId title so the intro morph lands on either. */}
              <div className="relative z-20 flex items-baseline gap-2.5 pb-8 md:z-auto md:gap-4 md:pt-4 md:pb-11">
                <motion.button
                  type="button"
                  onClick={close}
                  aria-label="뒤로 가기"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[22px] leading-none text-mute-500 transition-colors hover:text-ink md:hidden"
                >
                  ←
                </motion.button>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="hidden text-[11px] font-bold tracking-[.14em] text-mute-500 md:inline"
                >
                  {DETAIL_META[detail].n}
                </motion.span>
                <motion.h2
                  layoutId="detail-title"
                  transition={MORPH}
                  className="m-0 text-[22px] tracking-[-.02em] text-ink md:text-[34px]"
                >
                  {DETAIL_META[detail].title}
                </motion.h2>
              </div>
              <Stagger delay={0.5} step={0.12} className="flex flex-col">
                <DetailItems id={detail} />
              </Stagger>
            </div>
          )
        ) : (
          <SwapIn className="flex flex-col">
            {/* ---------- Hero (spans full width, content is viewport-centered
                 regardless of the right-pinned sections below) ---------- */}
            <header className="relative flex min-h-[calc(100vh-80px)] flex-col justify-center gap-8 px-5 md:min-h-screen md:px-6">
              <HeroName />
              <ScrollCue />
            </header>

            {/* Right-pinned content column (everything after the hero). Each
                section fills at least the viewport (min-h-screen) so neighbours
                never peek into the same screen; that also replaces the old
                inter-section gap. */}
            <div className={`flex flex-col [&>section]:min-h-screen [&>section]:py-6 ${CONTENT_COL}`}>
            {/* ---------- About ---------- */}
            <section id="about" className="!py-0">
              <About />
            </section>

            {/* ---------- Projects ---------- */}
            <section id="projects">
              <Divider />
              <SectionHead n="01" title="Projects" />
              <Stagger className="flex flex-col">
                {projects.slice(0, 3).map((p) => (
                  <StaggerItem key={p.id}><ProjectRow project={p} /></StaggerItem>
                ))}
              </Stagger>
              <Link href="/projects/" className={moreCls}>See 1 more project →</Link>
            </section>

            {/* ---------- Experience ---------- */}
            <section id="experience">
              <Divider />
              <SectionHead n="02" title="Experience" />
              <Stagger className="flex flex-col">
                {experienceWork.map((e) => (
                  <StaggerItem key={e.id}><TimelineRow item={e} href={detailHref("experience", e.id)} /></StaggerItem>
                ))}
              </Stagger>
              <Link href="/experience/" className={moreCls}>See {experienceExp.length} more →</Link>
            </section>

            {/* ---------- Certifications ---------- */}
            <section id="certifications">
              <Divider />
              <SectionHead n="03" title="Certifications" />
              <Stagger className="flex flex-col">
                {certList.map((c) => (
                  <StaggerItem key={c.id}><CertRow cert={c} href={detailHref("certifications", c.id)} /></StaggerItem>
                ))}
              </Stagger>
              <Link href="/certifications/" className={moreCls}>{`See all ${certList.length} →`}</Link>
            </section>

            {/* ---------- Education ---------- */}
            <section id="education">
              <Divider />
              <SectionHead n="04" title="Education" />
              <Stagger className="flex flex-col">
                {eduMain.map((e) => (
                  <StaggerItem key={e.id}><TimelineRow item={e} href={detailHref("education", e.id)} /></StaggerItem>
                ))}
              </Stagger>
              <Link href="/education/" className={moreCls}>See {eduCyberTraining.length + eduKeris.length} more →</Link>
            </section>

            {/* ---------- Awards (7 → 5) ---------- */}
            <section id="awards">
              <Divider />
              <SectionHead n="05" title="Awards" />
              <Stagger className="flex flex-col">
                {awards.slice(0, MORE_MAX).map((a, i) => (
                  <StaggerItem key={i}><AwardRow award={a} href={detailHref("awards", awardId(i))} /></StaggerItem>
                ))}
              </Stagger>
              <Link href="/awards/" className={moreCls}>{`See ${awards.length - MORE_MAX} more →`}</Link>
            </section>

            {/* ---------- Publications ---------- */}
            <section id="publications">
              <Divider />
              <SectionHead n="06" title="Publications" />
              <Stagger className="flex flex-col">
                {publications.map((p, i) => (
                  <StaggerItem key={i}><PublicationRow pub={p} href={detailHref("publications", pubId(i))} /></StaggerItem>
                ))}
              </Stagger>
              <Link href="/publications/" className={moreCls}>{`See all ${publications.length} →`}</Link>
            </section>

            {/* ---------- Skills ---------- */}
            <section id="skills">
              <Divider />
              <SectionHead n="07" title="Skills" />
              <Stagger className="flex flex-col">
                {skills.map((s) => (
                  <StaggerItem key={s.label}><SkillRow skill={s} href={detailHref("skills", skillId(s.label))} /></StaggerItem>
                ))}
              </Stagger>
              <Link href="/skills/" className={moreCls}>{`See all ${skills.length} →`}</Link>
            </section>

            {/* ---------- Activities (7) ---------- */}
            <section id="activities">
              <Divider />
              <SectionHead n="08" title="Activities" />
              <Stagger className="flex flex-col">
                {activities.slice(0, MORE_MAX).map((a, i) => (
                  <StaggerItem key={i}><ActivityRow activity={a} href={detailHref("activities", activityId(i))} /></StaggerItem>
                ))}
              </Stagger>
              <Link href="/activities/" className={moreCls}>{`See ${activities.length - MORE_MAX} more →`}</Link>
            </section>

            {/* ---------- Contact ---------- */}
            <section id="contact">
              <Divider />
              <SectionHead n="09" title="Contact" />
              <Reveal>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-block break-all text-[24px] font-bold tracking-[-.02em] text-ink no-underline hover:text-mute-700 md:text-[32px]"
                >
                  {profile.email}
                </a>
              </Reveal>
              <Stagger className="mt-8 flex flex-col">
                {[
                  { label: "GitHub", value: profile.github, href: profile.githubHref },
                  { label: "LinkedIn", value: profile.linkedin, href: profile.linkedinHref },
                ].map((c) => (
                  <StaggerItem key={c.label}>
                    <EntryRow meta={<span className="tracking-[.1em] uppercase">{c.label}</span>}>
                      <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-[15px] text-ink no-underline hover:text-mute-700">
                        {c.value}
                      </a>
                    </EntryRow>
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
            </div>
          </SwapIn>
        )}
      </main>
    </div>
    <ResumeFab onClick={downloadResume} busy={busy} />
    </>
  );
}
