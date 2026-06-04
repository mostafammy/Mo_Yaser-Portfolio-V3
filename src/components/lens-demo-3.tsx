/**
 * LensDemoDefaultPosition
 *
 * A lens with a default (starting) position. It sits centred until the user
 * hovers, then snaps to the cursor. When the cursor leaves, it animates
 * back to the default position.
 *
 * Great for hero images where you want the lens to hover over a key detail
 * (like a product logo) before the user even moves their mouse.
 */

"use client";
import React from "react";
import { Lens } from "@/components/ui/lens";

export default function LensDemoDefaultPosition() {
  return (
    <div className="flex items-center justify-center p-10">
      <Lens
        defaultPosition={{ x: 120, y: 80 }}
        zoomFactor={1.8}
        lensSize={200}
      >
        <div className="flex size-60 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-600 md:size-80">
          <span className="text-2xl font-bold text-white">Default Pos</span>
        </div>
      </Lens>
    </div>
  );
}
