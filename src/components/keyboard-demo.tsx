/**
 * KeyboardDemo
 *
 * A full-page showcase for the interactive on-screen Keyboard component.
 * Places the keyboard in the center of a large container so visitors can
 * click or type on their physical keyboard and see the visual + audio
 * feedback.
 *
 * When to use:
 * - Portfolio "gear" or "about" section to show off your mechanical
 *   keyboard aesthetic.
 * - Interactive hero / playground area where users can "type" on a
 *   realistic key layout.
 * - Any page where you want to demonstrate the Keyboard component with
 *   `enableSound` turned on.
 *
 * Sound: Requires `public/sounds/sound.ogg` — degrades gracefully if missing.
 */

"use client";
import React from "react";
import { Keyboard } from "@/components/ui/keyboard";

export default function KeyboardDemo() {
  return (
    <div className="flex min-h-96 w-full items-center justify-center py-10 md:min-h-180">
      <Keyboard enableSound />
    </div>
  );
}
