"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { profile } from "../data";
import { useScrollState } from "./ScrollState";

export const MORPH_ID = "brand-name";
export const PHOTO_ID = "brand-photo";
export const MORPH_T = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

// The hero headline cycles through these three labels, fading softly between
// each. English → Korean → nickname, then loops.
const NAME_WORDS = [profile.nameEn, profile.nameKo, profile.nickname];

/**
 * The big hero name, but self-swapping: it slowly blurs+fades out and the next
 * label fades back in, looping forever. Three invisible sizer copies (one per
 * word) hold the box at the widest word, so a swap never reflows the layout or
 * nudges the subtitle beneath it. Honours prefers-reduced-motion by holding
 * the English name still.
 */
function CyclingName() {
  const [i, setI] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((p) => (p + 1) % NAME_WORDS.length), 2600);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <span className="grid place-items-center text-[44px] font-bold tracking-[-.03em] text-ink md:text-[72px]">
      {NAME_WORDS.map((w) => (
        <span key={w} aria-hidden className="invisible whitespace-nowrap [grid-area:1/1]">
          {w}
        </span>
      ))}
      <span className="grid place-items-center [grid-area:1/1]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={reduce ? "static" : i}
            className="whitespace-nowrap"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {reduce ? profile.nameEn : NAME_WORDS[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

/**
 * The hero photo + name. On desktop both share a Framer `layoutId` with the
 * fixed top-left brand (SideNav); once scrolled past the hero they unmount and
 * the brand mounts, so Framer morphs them — the square photo rounds + shrinks
 * and the name flies up, assembling neatly in the corner. No morph on mobile.
 */
export default function HeroName() {
  const { scrolled, isDesktop } = useScrollState();
  if (isDesktop && scrolled) return null;
  const morph = isDesktop;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        layoutId={morph ? PHOTO_ID : undefined}
        transition={MORPH_T}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        src="/profile.jpeg"
        alt={`${profile.nameEn} (${profile.nameKo})`}
        style={{ borderRadius: 9999 }}
        className="h-32 w-32 self-center rounded-full border border-mute-300 object-cover md:h-52 md:w-52"
      />
      <motion.div
        layoutId={morph ? MORPH_ID : undefined}
        transition={MORPH_T}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center self-center text-center leading-[1.0]"
      >
        <CyclingName />
        {/* Hero greeting. NOTE: this is only the hero copy — the top-left
            morphed brand keeps rendering "정준영 · zer0base" from SideNav. */}
        <p className="mt-5 flex max-w-[54ch] flex-col gap-1 text-[16px] leading-[1.6] text-mute-600 md:mt-6 md:text-[20px]">
          <span className="font-semibold text-ink">Red Teaming · Vulnerability Assessment</span>
          <span>I look for the gap between the blueprint and the service.</span>
        </p>
      </motion.div>
    </>
  );
}
