/**
 * LensDemoStatic
 *
 * A static lens that always shows the magnified region at a fixed position.
 * Useful for before‑/after comparisons or highlighting a specific detail
 * without requiring hover interaction.
 */

"use client";
import React from "react";
import { Lens } from "@/components/ui/lens";

export default function LensDemoStatic() {
  return (
    <div className="flex items-center justify-center p-10">
      <Lens isStatic position={{ x: 100, y: 80 }} zoomFactor={2}>
        <div className="flex size-60 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-700 md:size-80">
          <span className="text-2xl font-bold text-white">Static Lens</span>
        </div>
      </Lens>
    </div>
  );
}
