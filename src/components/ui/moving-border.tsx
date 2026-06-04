/**
 * MovingBorder / Button
 *
 * An animated-gradient-border button. A glowing orb travels along an SVG
 * rect path (matching the button's border radius), producing a smooth
 * rotating highlight effect. The inner button has a frosted-glass backdrop.
 *
 * When to use:
 * - CTA buttons, nav items, or any interactive element that needs a
 *   polished "cyber" / glassmorphic treatment.
 * - Hero sections where a single standout button draws the eye.
 * - Portfolio project cards as a "View Case Study" or "Live Demo" CTA.
 *
 * Exports:
 *   Button        — pre‑composed CTA button with MovingBorder inside.
 *   MovingBorder  — low‑level animated SVG‑path border (use for custom
 *                   shapes or wrapping other elements).
 *
 * Button props:
 *   borderRadius?: string   — CSS border-radius value (default "1.75rem").
 *   children: ReactNode     — button label / content.
 *   as?: React.ElementType  — rendered tag (default "button").
 *   containerClassName?     — outer wrapper classes.
 *   borderClassName?        — classes for the glowing orb.
 *   duration?: number       — full‑orbit time in ms (default 3000).
 *   className?              — inner button surface classes.
 *   ...otherProps           — forwarded to the root element.
 *
 * MovingBorder props:
 *   duration?: number  — orbit duration in ms (default 3000).
 *   rx / ry?: string   — SVG rect corner radii.
 *   children           — the glow element to orbit.
 *
 * Animation:
 *   Uses `useAnimationFrame` + `useMotionValue` to track position along
 *   the SVG rect's perimeter. The glow element is positioned via
 *   `translateX`/`translateY` transforms driven by the path progress.
 */

"use client";
import React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
        "relative h-16 w-40 overflow-hidden bg-transparent p-[1px] text-xl",
        containerClassName,
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 bg-[radial-gradient(#0ea5e9_40%,transparent_60%)] opacity-[0.8]",
              borderClassName,
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border border-slate-800 bg-slate-900/[0.8] text-sm text-white antialiased backdrop-blur-xl",
          className,
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<any>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x,
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y,
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
