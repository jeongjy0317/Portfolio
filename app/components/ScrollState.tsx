"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface ScrollState {
  scrolled: boolean; // scrolled past most of the first viewport (hero)
  isDesktop: boolean;
}

const Ctx = createContext<ScrollState>({ scrolled: false, isDesktop: false });
export const useScrollState = () => useContext(Ctx);

export function ScrollStateProvider({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const updMq = () => setIsDesktop(mq.matches);
    updMq();
    mq.addEventListener("change", updMq);

    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      mq.removeEventListener("change", updMq);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <Ctx.Provider value={{ scrolled, isDesktop }}>{children}</Ctx.Provider>;
}
