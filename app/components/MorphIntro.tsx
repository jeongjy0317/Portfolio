"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Divider } from "./ui";

// Shared-element morph timing (mirrors the overview's MORPH constant).
const MORPH = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

/**
 * Detail-page entrance that reproduces the overview's shared-element morph:
 * the section title first blooms BIG and dead-center, then flies UP into the
 * page header (framer `layoutId` morph) while the back link, rule and content
 * fade in behind it. Replaces SwapIn + DetailHeader on the standalone detail
 * pages so arriving from a "See more →" link keeps the same transition the
 * in-page overlay used to have.
 */
export default function MorphIntro({
  n,
  title,
  count,
  children,
}: {
  n: string;
  title: string;
  count?: string;
  children: ReactNode;
}) {
  const [phase, setPhase] = useState<"intro" | "full">("intro");

  // Let the big centered title bloom in and rest a beat, then morph up.
  useEffect(() => {
    const t = setTimeout(() => setPhase("full"), 900);
    return () => clearTimeout(t);
  }, []);

  if (phase === "intro") {
    // Phase 1 — the title appears BIG, dead-center, over a clean paper wash.
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-paper px-6">
        <motion.h1
          layoutId="detail-title"
          initial={{ scale: 0.35, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={MORPH}
          className="m-0 text-center text-[16vw] tracking-[-.02em] text-ink md:text-[120px]"
        >
          {title}
        </motion.h1>
      </div>
    );
  }

  // Phase 2 — the SAME title has flown up into the header (layoutId morph);
  // the chrome fades and the content reveals after it lands.
  return (
    <>
      <motion.a
        href="/"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="inline-block pb-12 text-[10px] font-bold tracking-[.16em] uppercase text-mute-600 no-underline"
      >
        ← Overview
      </motion.a>
      <div className="flex items-baseline gap-4 pb-4">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="text-[11px] font-bold tracking-[.14em] text-mute-500"
        >
          {n}
        </motion.span>
        <motion.h1
          layoutId="detail-title"
          transition={MORPH}
          className="m-0 text-[32px] tracking-[-.03em] text-ink md:text-[48px]"
        >
          {title}
        </motion.h1>
        {count && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="ml-auto text-[12px] font-semibold text-mute-600"
          >
            {count}
          </motion.span>
        )}
      </div>
      <Divider />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.45 }}>
        {children}
      </motion.div>
    </>
  );
}
