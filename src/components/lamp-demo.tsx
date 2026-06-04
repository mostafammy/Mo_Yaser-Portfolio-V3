/**
 * LampDemo
 *
 * A showcase hero section for the LampContainer component. Places a
 * gradient‑text heading inside the lamp beam's glow zone.
 *
 * When to use:
 * - Portfolio "hero" or "featured project" lead‑in where you want a
 *   dramatic, dark‑themed header with a sweeping cyan light effect.
 * - Any page that needs a cinematic scroll‑triggered entrance.
 *
 * Pro tip:
 *   Swap the heading text for your own tagline; the gradient classes
 *   `from-slate-300 to-slate-500` work well with the cyan lamp beam.
 */

"use client";
import React from "react";
import { motion } from "motion/react";
import { LampContainer } from "@/components/ui/lamp";

export default function LampDemo() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Build lamps <br /> the right way
      </motion.h1>
    </LampContainer>
  );
}
