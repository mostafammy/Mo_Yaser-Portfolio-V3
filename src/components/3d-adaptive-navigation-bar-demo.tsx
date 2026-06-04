/**
 * PillBase Demo
 *
 * Renders the 3D Adaptive Navigation Pill on a white canvas for preview.
 * Drop this into any page layout to try the collapsed ↔ expanded morph.
 *
 * When to use:
 *   - Preview / documentation page for the component.
 *   - Drop‑in replacement for a static nav bar during development.
 */

import { PillBase } from "@/components/ui/3d-adaptive-navigation-bar";

export default function Demo() {
  return (
    <div
      style={{
        background: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PillBase />
    </div>
  );
}
