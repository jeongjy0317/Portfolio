"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * The one hint that the hero is not the whole page: a chevron resting at the
 * foot of the first screen, bobbing slowly. It arrives after the name and the
 * greeting have settled (delay), and fades the moment the reader takes the
 * hint — a cue that keeps nagging after it has been obeyed reads as decoration.
 *
 * The bob is a CSS keyframe on the inner span, deliberately NOT a Framer
 * animation: this element's `transform` belongs to the loop, and Framer only
 * drives `opacity` on the wrapper, so the two never fight over one property.
 * `prefers-reduced-motion` drops the loop in globals.css and leaves the arrow.
 */
export default function ScrollCue() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const onScroll = () => setGone(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: gone ? 0 : 1 }}
      transition={{ duration: 0.5, delay: gone ? 0 : 1.2 }}
      className={`absolute inset-x-0 bottom-9 flex justify-center md:bottom-12 ${gone ? "pointer-events-none" : ""}`}
    >
      <a
        href="#about"
        aria-label="아래로 스크롤"
        className="scroll-cue group flex h-11 w-11 items-center justify-center text-mute-500 transition-colors hover:text-ink"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="h-6 w-6"
        >
          <path d="M12 5v13" />
          <path d="m6 13 6 6 6-6" />
        </svg>
      </a>
    </motion.div>
  );
}
