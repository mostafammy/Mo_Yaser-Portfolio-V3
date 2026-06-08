/*
 * ─── MacbookScroll ────────────────────────────────────────────────────────────
 * PURPOSE:  Renders a MacBook mockup with a scrollable screen area.
 *           Perfect for case‑study hero sections, portfolio showcases, or demo
 *           previews where you want to present a website/app inside a realistic
 *           laptop frame.
 *
 * WHEN TO USE:
 *   - Hero / intro section of a case study.
 *   - Showcasing a live demo or screenshot reel.
 *   - Anywhere you need a "device‑framed" preview that scrolls.
 *
 * PROPS:
 *   title        ReactNode  — displayed above the MacBook (headline / tagline).
 *   badge?       ReactNode  — optional decorative badge (e.g. Peerlist logo).
 *   src          string     — image URL to load inside the screen viewport.
 *   showGradient boolean    — whether to fade the bottom of the screen (default: true).
 *   className?   string     — additional wrapper classes.
 *
 * CHILDREN:
 *   You may also pass children instead of an `src` image for custom content
 *   inside the screen (e.g. an <iframe> or interactive demo).
 *
 * ANIMATION:
 *   - The lid tilts up on mount (3D perspective, spring).
 *   - The screen content scrolls via a CSS marquee‑like animation.
 *   - Subtle glow effect on the screen when hovering.
 *
 * ACCESSIBILITY:
 *   - The image/children inside the viewport get role="presentation".
 *   - The outer container is a <section> with aria‑label.
 * ──────────────────────────────────────────────────────────────────────────────
 */

"use client";
/* eslint-disable @next/next/no-img-element */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type MacbookScrollProps = {
  title?: ReactNode;
  badge?: ReactNode;
  src?: string;
  showGradient?: boolean;
  className?: string;
  children?: ReactNode;
};

/* ── Internal dimensions (proportional to a 14" MacBook) ── */
const SCREEN_RATIO = 16 / 10;
const LID_LIP_HEIGHT = 16; /* px — the little notch lip */
const BASE_WIDTH = 720;
const SCREEN_WIDTH = BASE_WIDTH;
const SCREEN_HEIGHT = SCREEN_WIDTH / SCREEN_RATIO;

export default function MacbookScroll({
  title,
  badge,
  src,
  showGradient = true,
  className = "",
  children,
}: MacbookScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lidRotateX = useTransform(scrollYProgress, [0, 0.3], [25, 0]);
  const lidOpacity = useTransform(scrollYProgress, [0, 0.2], [0.6, 1]);
  const screenScale = useTransform(scrollYProgress, [0, 0.25], [0.85, 1]);

  return (
    <section
      ref={containerRef}
      aria-label="MacBook mockup"
      className={`relative w-full ${className}`}
    >
      {/* ── Title + Badge ── */}
      {title && (
        <div className="relative z-10 mx-auto mb-8 max-w-4xl text-center">
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 flex justify-center"
            >
              {badge}
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl lg:text-5xl"
          >
            {title}
          </motion.div>
        </div>
      )}

      {/* ── MacBook Container ── */}
      <motion.div
        className="mx-auto"
        style={{
          perspective: 1200,
          width: BASE_WIDTH,
          maxWidth: "100%",
        }}
      >
        {/* ── Lid (screen area) ── */}
        <motion.div
          style={{
            rotateX: lidRotateX,
            opacity: lidOpacity,
            scale: screenScale,
            transformStyle: "preserve-3d",
            transformOrigin: "bottom center",
          }}
          className="relative origin-bottom"
        >
          {/* screen bezel */}
          <div
            className="relative mx-auto overflow-hidden rounded-[18px] border-[6px] border-neutral-800 bg-black shadow-2xl dark:border-neutral-700"
            style={{
              width: SCREEN_WIDTH,
              maxWidth: "100%",
              height: SCREEN_HEIGHT,
            }}
          >
            {/* ── notch (centered) ── */}
            <div className="absolute left-1/2 top-0 z-20 h-[18px] w-[90px] -translate-x-1/2 rounded-b-xl bg-black" />
            <div className="absolute left-1/2 top-1 z-20 h-2 w-2 -translate-x-1/2 rounded-full bg-neutral-700" />

            {/* ── viewport content ── */}
            <div
              ref={screenRef}
              className="no-scrollbar h-full w-full overflow-y-auto overflow-x-hidden"
            >
              {children ? (
                children
              ) : src ? (
                <img
                  src={src}
                  alt=""
                  role="presentation"
                  className="block w-full"
                  style={{
                    minHeight: "200%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white text-neutral-400 dark:bg-neutral-900">
                  <span className="text-sm">Preview</span>
                </div>
              )}
            </div>

            {/* ── bottom gradient overlay ── */}
            {showGradient && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
            )}
          </div>

          {/* ── lid lip (the slight protrusion below the screen) ── */}
          <div
            className="mx-auto bg-neutral-800 dark:bg-neutral-700"
            style={{
              width: SCREEN_WIDTH + 16,
              maxWidth: "calc(100% + 16px)",
              height: LID_LIP_HEIGHT,
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
            }}
          />

          {/* ── base / keyboard area ── */}
          <div
            className="relative mx-auto rounded-b-[12px] bg-neutral-800 pb-3 dark:bg-neutral-700"
            style={{
              width: SCREEN_WIDTH + 40,
              maxWidth: "calc(100% + 40px)",
              height: 22,
            }}
          >
            {/* hinge indent */}
            <div className="absolute inset-x-0 -top-[2px] mx-auto h-[4px] w-[60%] rounded-full bg-neutral-700 dark:bg-neutral-600" />
          </div>

          {/* ── subtle glow ── */}
          <div
            className="pointer-events-none absolute -inset-4 z-[-1] rounded-[28px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(ellipse at 50% 80%, rgba(99,102,241,0.15), transparent 70%)",
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
