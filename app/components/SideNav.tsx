"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { profile, type NavItem } from "../data";
import { useScrollState } from "./ScrollState";
import { MORPH_ID, PHOTO_ID, MORPH_T } from "./HeroName";

/**
 * Fixed, vertically-centered scroll-spy navigation.
 * Reproduces reference/*.dc.html behaviour: the section whose top has crossed
 * 40% of the viewport height becomes active — rendered black, bold (800) and
 * scaled up; inactive items stay small, regular weight, neutral-500.
 */
export default function SideNav({
  items,
  base = 13,
  activeScale = 1.5,
  backHref,
  detail = null,
}: {
  items: NavItem[];
  base?: number;
  activeScale?: number;
  backHref?: string;
  detail?: { id: string; label: string; onBack: () => void } | null;
}) {
  const detailMode = !!detail;
  const detailLabelStyle: CSSProperties = {
    textDecoration: "none",
    fontFamily: "var(--font-sans)",
    fontSize: "22px",
    fontWeight: 800,
    color: "#000",
    letterSpacing: "-0.01em",
    lineHeight: 1.1,
    whiteSpace: "nowrap",
    transition: "font-size .45s cubic-bezier(.22,1,.36,1), letter-spacing .45s ease, color .45s ease",
  };
  const selIndex = detail ? items.findIndex((it) => it.id === detail.id) : -1;
  // Remember the last-selected index so the diverge (on back) can stagger too.
  const [lastSelIndex, setLastSelIndex] = useState(-1);
  useEffect(() => {
    if (selIndex >= 0) setLastSelIndex(selIndex);
  }, [selIndex]);
  const refIndex = detailMode ? selIndex : lastSelIndex;
  const [active, setActive] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { scrolled, isDesktop } = useScrollState();

  // Desktop: the vertical scroll-spy nav is tucked off to the left and hidden
  // while on the hero, then slides in left→right the moment you scroll past it
  // (mirrors the top-left brand, which also appears on scroll). Detail view is
  // pinned to the top (scrolled === false) but must keep the nav visible.
  const hiddenNav = isDesktop && !scrolled && !detailMode;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Keep the active item centered in the mobile horizontal bar.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    if (nav.scrollWidth <= nav.clientWidth) return; // vertical (desktop) — nothing to scroll
    const el = nav.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!el) return;
    const target = el.offsetLeft - nav.clientWidth / 2 + el.offsetWidth / 2;
    if (Math.abs(nav.scrollLeft - target) < 4) return; // already centered — skip micro-jitter
    nav.scrollTo({ left: target, behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    const ids = items.map((i) => i.id);
    const onScroll = () => {
      const line = window.innerHeight * 0.4;
      let cur: string | null = null; // nothing selected until a section crosses the line
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) cur = id;
      }
      setActive((prev) => (prev !== cur ? cur : prev));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  const navStyle = (isActive: boolean): CSSProperties => {
    // Desktop grows the active item dramatically (vertical layout, no reflow of
    // the row it sits on). On the horizontal mobile bar a big size jump shifts
    // every sibling AND moves the centering target mid-animation, so scale it
    // back to a gentle bump and lean on weight/colour for emphasis instead.
    const scale = isMobile ? 1.12 : activeScale;
    return {
      textDecoration: "none",
      fontFamily: "var(--font-sans)",
      letterSpacing: isActive ? "-0.01em" : "0.02em",
      fontSize: (isActive ? base * scale : base) + "px",
      fontWeight: isActive ? 800 : 400,
      color: isActive ? "#000" : "var(--color-mute-500)",
      lineHeight: 1.1,
      whiteSpace: "nowrap",
      transition:
        "font-size .3s cubic-bezier(.2,.7,.2,1), color .3s ease, font-weight .3s ease, letter-spacing .3s ease",
      outline: "none",
    };
  };

  return (
    <>
      {/* Mobile only: top-down progressive blur + paper gradient so scrolling
          content is drawn up and dissolves into the top edge. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-10 h-44 md:hidden"
        style={{
          // Slight blur behind the top edge; the mask below fades it out too.
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          // Multi-stop paper wash — opaque at the very top, then dissolving
          // through several transparency levels so content melts away softly.
          background:
            "linear-gradient(to bottom, #f3f2f2 0%, #f3f2f2 34%, rgba(243,242,242,0.72) 54%, rgba(243,242,242,0.4) 72%, rgba(243,242,242,0.16) 87%, rgba(243,242,242,0) 100%)",
          // Fade the whole layer (blur included) on the same gradual curve.
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 30%, rgba(0,0,0,0.65) 54%, rgba(0,0,0,0.35) 73%, rgba(0,0,0,0.12) 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 30%, rgba(0,0,0,0.65) 54%, rgba(0,0,0,0.35) 73%, rgba(0,0,0,0.12) 88%, transparent 100%)",
        }}
      />

      {/* Brand — fixed name, top-left.
          Mobile: single-line, always visible.
          Desktop: the hero name morphs up into this spot (shared layoutId) once
          scrolled past the hero; hidden while still on the hero. */}
      {isDesktop ? (
        (scrolled || detailMode) && (
          <div className="fixed left-14 top-8 z-30 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              layoutId={detailMode ? undefined : PHOTO_ID}
              transition={MORPH_T}
              src="/profile.jpeg"
              alt={`${profile.nameEn} (${profile.nameKo})`}
              style={{ borderRadius: 9999 }}
              className="h-11 w-11 border border-mute-300 object-cover"
            />
            <motion.a
              href="/"
              layoutId={detailMode ? undefined : MORPH_ID}
              transition={MORPH_T}
              aria-label={`${profile.nameEn} — 홈`}
              className="flex flex-col leading-[1.0] no-underline"
            >
              <span className="text-[20px] font-bold tracking-[-.03em] text-ink">{profile.nameEn}</span>
              <span className="mt-1 text-[14px] text-mute-600">
                {profile.nameKo} <span className="text-mute-400">·</span>{" "}
                <span className="font-semibold text-ink">{profile.nickname}</span>
              </span>
            </motion.a>
          </div>
        )
      ) : (
        <a
          href="/"
          aria-label={`${profile.nameEn} — 홈`}
          className="fixed left-5 top-3 z-30 flex flex-col leading-tight no-underline"
        >
          <span className="text-[18px] font-bold tracking-[-.01em] text-ink">
            {profile.nameEn}
            <span className="text-[13px] font-normal text-mute-500"> ({profile.nameKo})</span>
          </span>
        </a>
      )}

      <motion.nav
        ref={navRef}
        aria-label="섹션 내비게이션"
        initial={false}
        animate={{
          x: hiddenNav ? -80 : 0,
          // Framer owns the transform, so vertical centering (was the Tailwind
          // md:-translate-y-1/2) has to live here too, else `x` would wipe it.
          y: isDesktop ? "-50%" : 0,
          opacity: hiddenNav ? 0 : 1,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: hiddenNav ? "none" : "auto" }}
        className={`fixed left-0 right-0 top-11 z-20 flex flex-row items-center gap-4 overflow-x-auto px-[50%] py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:left-14 md:right-auto md:top-1/2 md:z-[5] md:flex-col md:items-start md:gap-5 md:overflow-visible md:px-0 md:py-0 ${
          detailMode ? "max-md:hidden" : ""
        }`}
      >
        {!detailMode && backHref && (
          <a
            href={backHref}
            className="pr-2 text-[11px] font-bold tracking-[.14em] uppercase text-mute-600 no-underline md:pr-0 md:pb-3"
          >
            ← Back
          </a>
        )}

        {items.map((it, i) => {
          const isSel = detailMode && it.id === detail!.id;
          const hidden = detailMode && !isSel;
          const dist = refIndex >= 0 ? refIndex - i : 0; // >0: above selected, <0: below
          return (
            <motion.a
              key={it.id}
              data-id={it.id}
              href={detailMode ? undefined : "#" + it.id}
              onClick={(e) => {
                if (detailMode) {
                  // In detail view the selected label doubles as the back control.
                  if (isSel) {
                    e.preventDefault();
                    detail!.onBack();
                  }
                } else {
                  handleClick(e, it.id);
                }
              }}
              aria-label={isSel ? `${it.label} — 뒤로 가기` : undefined}
              aria-current={!detailMode && active === it.id ? "true" : undefined}
              animate={{
                opacity: hidden ? 0 : 1,
                y: hidden ? dist * 18 : 0, // converge toward the selected item's slot
                scale: hidden ? 0.85 : 1,
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: Math.abs(dist) * 0.03 }}
              style={{
                ...(isSel ? detailLabelStyle : navStyle(active === it.id)),
                pointerEvents: hidden ? "none" : "auto",
                cursor: isSel ? "pointer" : undefined,
              }}
            >
              {isSel ? `← ${it.label}` : it.label}
            </motion.a>
          );
        })}
      </motion.nav>
    </>
  );
}
