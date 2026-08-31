"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollState } from "./ScrollState";

/**
 * Floating "이력서" download button, pinned bottom-right.
 * - Hidden on the hero (top-of-page name); appears once scrolled into content.
 * - While the page is scrolling it slides off to the right ("샥"), then glides
 *   back once scrolling settles (~320ms idle).
 * - Rests slightly translucent, fades to fully opaque on hover.
 * - On click it collapses to a round spinner; when the PDF is ready it flashes
 *   a check mark, then expands back to the label.
 * Every state change shares a duration'd transition so it reads as one motion.
 */
export default function ResumeFab({ onClick, busy }: { onClick: () => void; busy: boolean }) {
  const { scrolled } = useScrollState();
  const [scrolling, setScrolling] = useState(false);
  const [done, setDone] = useState(false);
  const wasBusy = useRef(false);

  // Detect scroll → hide, idle → show.
  useEffect(() => {
    let idle: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      setScrolling(true);
      clearTimeout(idle);
      idle = setTimeout(() => setScrolling(false), 320);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(idle);
    };
  }, []);

  // When generation finishes (busy true → false), flash the check for a beat.
  useEffect(() => {
    if (wasBusy.current && !busy) {
      setDone(true);
      const t = setTimeout(() => setDone(false), 1600);
      wasBusy.current = busy;
      return () => clearTimeout(t);
    }
    wasBusy.current = busy;
  }, [busy]);

  const collapsed = busy || done; // round icon-only state
  // Stay put (and visible) while busy/done; otherwise hide on hero + while scrolling.
  const offscreen = !collapsed && (scrolling || !scrolled);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-label="이력서 다운로드 (PDF)"
      className={`fixed bottom-6 right-6 z-30 inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-ink font-bold text-paper shadow-lg shadow-black/20 transition-all duration-300 ease-out disabled:cursor-wait md:bottom-8 md:right-8 ${
        collapsed ? "w-12 px-0" : "px-6 text-[14px] tracking-[.01em]"
      } ${collapsed ? "opacity-100" : "opacity-65 hover:opacity-100"} ${
        offscreen ? "pointer-events-none translate-x-[calc(100%_+_2.5rem)]" : "translate-x-0"
      }`}
    >
      {busy ? (
        // Spinner
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-5 w-5 animate-spin"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
        >
          <path d="M12 3a9 9 0 1 0 9 9" />
        </svg>
      ) : done ? (
        // Check
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <>
          이력서
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4v14M6 12l6 6 6-6" />
          </svg>
        </>
      )}
    </button>
  );
}
