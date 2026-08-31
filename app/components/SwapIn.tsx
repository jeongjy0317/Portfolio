"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * In-place content swap. Animates only the content block (not the persistent
 * fixed nav), so navigating into a page reads like a component swap rather than
 * a full page transition. Safe to transform — no fixed descendants live here.
 */
export default function SwapIn({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
