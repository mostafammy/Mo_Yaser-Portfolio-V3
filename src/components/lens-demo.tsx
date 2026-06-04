/**
 * LensDemo
 *
 * A default lens example: hover over the gradient card to magnify it.
 * The lens follows the cursor with a smooth enter/exit animation.
 *
 * When to use:
 * - Portfolio image galleries or hero visuals where you want an
 *   interactive "hover to zoom" effect.
 */

"use client";
import React from "react";
import { Lens } from "@/components/ui/lens";

export default function LensDemo() {
  return (
    <div className="flex items-center justify-center p-10">
      <Lens>
        <div className="flex size-60 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 md:size-80">
          <span className="text-2xl font-bold text-white">Hover to Zoom</span>
        </div>
      </Lens>
    </div>
  );
}
