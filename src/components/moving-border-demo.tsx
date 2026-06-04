/**
 * MovingBorderDemo
 *
 * A simple showcase for the animated-gradient-border Button. Renders a
 * single CTA with the default sky‑blue orb animation.
 *
 * When to use:
 * - Portfolio CTA sections, hero buttons, or "get in touch" links.
 * - Any page where you want to demonstrate the MovingBorder effect
 *   with minimal setup.
 */

"use client";
import React from "react";
import { Button } from "@/components/ui/moving-border";

export default function MovingBorderDemo() {
  return (
    <div>
      <Button
        borderRadius="1.75rem"
        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
      >
        Borders are cool
      </Button>
    </div>
  );
}
