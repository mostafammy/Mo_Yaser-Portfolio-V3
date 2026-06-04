/**
 * DottedGlowBackgroundDemo
 *
 * A showcase card demonstrating the DottedGlowBackground component in a
 * product-card layout — perfect for portfolio "featured work" grids,
 * testimonial panels, or tech-stack badges that need a subtle animated
 * backdrop without distracting from the content.
 *
 * When to use:
 * - Portfolio case-study cards where you want a "techy" yet unobtrusive
 *   animated dot grid behind the product logo / screenshot
 * - Feature highlight sections that need a light-up backdrop but should
 *   remain readable (the mask‑to‑radial edge fade ensures the dots are
 *   visible only at the outer ring)
 * - Any card / panel that uses a DottedGlowBackground and needs a
 *   reference implementation for props like `colorLightVar`, `glowColorDarkVar`,
 *   `speedMin` / `speedMax`, and `gap`
 *
 * Design notes:
 * - The outer container uses `mask-image: radial-gradient(...)` to fade
 *   the dot grid toward the center, so the logo stays clean.
 * - `rounded-tl-3xl` / `rounded-br-3xl` / `rounded-bl-3xl` create the
 *   asymmetric corner treatment common in modern portfolio cards.
 * - The backdrop-blur on the bottom bar adds glass‑morphism depth.
 * - All colour references route through CSS variables (`--color-neutral-500`,
 *   `--color-sky-800`, etc.) so they respect the active theme.
 */

import React from "react";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export default function DottedGlowBackgroundDemo() {
  return (
    <div
      className="relative flex size-60 items-end justify-end overflow-hidden rounded-md rounded-tl-3xl rounded-br-3xl rounded-bl-3xl border border-transparent px-4 shadow ring-1 shadow-black/10 ring-black/5 md:size-100 dark:shadow-white/10 dark:ring-white/5"
      style={{
        maskImage:
          "radial-gradient(ellipse at center, black 0%, transparent 90%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 0%, transparent 90%)",
      }}
    >
      <img
        src="https://assets.aceternity.com/logos/calcom.png"
        alt="Cal.com logo"
        className="absolute inset-0 z-20 m-auto size-10 md:size-20 dark:invert dark:filter"
      />
      <div className="relative z-20 flex w-full justify-between px-2 py-3 backdrop-blur-[2px] md:px-4">
        <p className="text-xs font-normal text-neutral-600 md:text-sm dark:text-neutral-400">
          The modern call scheduling app
        </p>
        <p className="text-xs font-normal text-neutral-600 md:text-sm dark:text-neutral-400">
          &rarr;
        </p>
      </div>
      <DottedGlowBackground
        className="pointer-events-none"
        opacity={1}
        gap={10}
        radius={1.6}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />
    </div>
  );
}
