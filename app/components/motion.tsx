"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Scroll trigger shared by `Stagger` and `Reveal`.
 *
 *  `amount` is a fraction of the ELEMENT, not of the screen, so a percentage
 *  threshold is unreachable once the element is taller than `viewport / amount`
 *  — the old `amount: 0.15` needed 1245px of an 8300px awards list visible on a
 *  812px phone, so nothing on /awards ever left `hidden`. `"some"` keeps the
 *  trigger height-independent; the negative bottom margin restores the "let it
 *  rise a little into view first" beat that `amount` used to provide. */
const VIEWPORT = { once: true, amount: "some", margin: "0px 0px -12% 0px" } as const;

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** Scroll-triggered container: its <StaggerItem> children rise in one after
 *  another. `delay` holds the children back so a heading can settle first. */
export function Stagger({
  children,
  className,
  delay = 0,
  step = 0.09,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  step?: number;
}) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: step, delayChildren: 0.04 + delay } },
  };
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

/** Standalone rise-in for one-off elements (hero lines, headings). */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
