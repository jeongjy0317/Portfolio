"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import type { GalleryImage } from "../data";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "./Dialog";

const IMAGE_MORPH = {
  type: "spring" as const,
  stiffness: 260,
  damping: 30,
  mass: 0.85,
};

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden
      className={className}
    >
      <path d="M6 6 18 18M18 6 6 18" />
    </svg>
  );
}

/**
 * A single image tile. Fills its parent (size the parent, e.g. with an
 * aspect-ratio box). Empty by default — click to attach a local image, hover
 * to reveal a magnifier, click a filled tile to open the fullscreen dialog.
 */
export function ImageSlot({
  image,
  placeholder = "이미지",
  className = "",
}: {
  image?: GalleryImage;
  placeholder?: string;
  className?: string;
}) {
  const providedSrc = typeof image === "object" ? image.src : null;
  const alt = typeof image === "object" ? image.alt : placeholder;
  const fit = typeof image === "object" ? image.fit ?? "cover" : "cover";
  const [pickedSrc, setPickedSrc] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const morphGroupId = useId();
  const src = pickedSrc ?? providedSrc;

  const pick = () => inputRef.current?.click();
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPickedSrc(URL.createObjectURL(f));
  };

  return (
    <div className={`group relative h-full w-full overflow-hidden border border-mute-300 bg-tag ${className}`}>
      {src ? (
        <LayoutGroup id={morphGroupId}>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              aria-label={`${alt} 확대 보기`}
              onPointerDown={(e) => e.stopPropagation()}
              className="group/trigger relative flex h-full w-full cursor-zoom-in items-center justify-center overflow-hidden border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
            >
              <motion.span
                layoutId="image-frame"
                transition={IMAGE_MORPH}
                className="flex h-full w-full items-center justify-center overflow-hidden bg-tag"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt}
                  draggable={false}
                  className={`h-full w-full ${fit === "contain" ? "object-contain p-2" : "object-cover"}`}
                />
              </motion.span>
              <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-200 group-hover/trigger:bg-ink/30 group-focus-visible/trigger:bg-ink/30" />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-paper opacity-0 transition-opacity duration-200 group-hover/trigger:opacity-100 group-focus-visible/trigger:opacity-100">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/50 bg-ink/35 backdrop-blur-[2px]">
                  <SearchIcon className="h-5 w-5" />
                </span>
              </span>
            </DialogTrigger>

            <DialogContent
              render={<motion.div layoutId="image-frame" transition={IMAGE_MORPH} />}
              onBackdropClick={() => setOpen(false)}
              onClick={(event) => {
                if (event.target === event.currentTarget) setOpen(false);
              }}
              className="h-[min(90dvh,960px)] w-[min(92vw,1200px)] overflow-hidden bg-paper p-4 shadow-[0_32px_100px_rgba(0,0,0,.38)] md:p-6"
            >
              <DialogTitle className="sr-only">{alt} 확대 보기</DialogTitle>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} className="h-full w-full object-contain" />
              <DialogClose
                aria-label="확대 이미지 닫기"
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 flex h-10 w-10 cursor-pointer items-center justify-center border border-paper/25 bg-ink/85 p-0 text-paper transition-colors duration-200 hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
              >
                <CloseIcon className="h-5 w-5" />
              </DialogClose>
            </DialogContent>
          </Dialog>
        </LayoutGroup>
      ) : (
        <button
          type="button"
          onClick={pick}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="이미지 추가"
          className="flex h-full w-full cursor-pointer items-center justify-center overflow-hidden border-0 bg-transparent p-0"
        >
          <span className="flex flex-col items-center gap-2.5 text-mute-500 transition-colors duration-300 group-hover:text-mute-700">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-mute-400 text-[15px] leading-none transition-transform duration-300 ease-out group-hover:scale-110">
              ＋
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[.16em]">{placeholder}</span>
          </span>
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
    </div>
  );
}

/**
 * Horizontal snap slider — kept on every viewport. Tiles peek the next one on
 * mobile and settle to a fixed width on large screens. Hidden scrollbar, snap.
 */
export function ImageGallery({ images, aspect = "aspect-[4/3]" }: { images: GalleryImage[]; aspect?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, prevX: 0, vel: 0, moved: false });
  const raf = useRef<number | null>(null);

  const stopMomentum = () => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
  };

  // Vertical mouse wheel scrolls the slider horizontally.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if ((e.deltaY > 0 && atEnd) || (e.deltaY < 0 && atStart)) return;
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      stopMomentum();
    };
  }, []);

  // Click-and-drag to scroll, with inertial glide on release (mouse only).
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    stopMomentum();
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, prevX: e.clientX, vel: 0, moved: false };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    const s = drag.current;
    if (!el || !s.down) return;
    const dx = e.clientX - s.startX;
    if (Math.abs(dx) > 4) s.moved = true;
    el.scrollLeft = s.startLeft - dx;
    s.vel = s.prevX - e.clientX; // scroll delta this frame
    s.prevX = e.clientX;
  };
  const endDrag = (e: React.PointerEvent) => {
    const el = ref.current;
    const s = drag.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    s.down = false;
    if (!el || Math.abs(s.vel) < 0.5) return;
    let v = s.vel;
    const glide = () => {
      v *= 0.92; // decay
      if (Math.abs(v) < 0.4) {
        raf.current = null;
        return;
      }
      el.scrollLeft += v;
      raf.current = requestAnimationFrame(glide);
    };
    raf.current = requestAnimationFrame(glide);
  };
  // Swallow the click that follows a real drag so tiles don't open the zoom.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      className="flex cursor-grab select-none gap-3 overflow-x-auto pb-1 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {images.map((item, i) => (
        <div key={i} className={`${aspect} w-[80%] shrink-0 sm:w-[47%] lg:w-[360px]`}>
          <ImageSlot image={item} placeholder={typeof item === "string" ? item : item.alt} />
        </div>
      ))}
    </div>
  );
}

/** Unified responsive grid — same tile design as the slider. */
export function ImageGrid({ images, aspect = "aspect-[4/3]" }: { images: GalleryImage[]; aspect?: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((item, i) => (
        <div key={i} className={aspect}>
          <ImageSlot image={item} placeholder={typeof item === "string" ? item : item.alt} />
        </div>
      ))}
    </div>
  );
}
