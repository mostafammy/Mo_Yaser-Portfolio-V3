/**
 * DockDemo
 *
 * A macOS‑style magnifying dock with default settings. Icons scale up
 * springily as the cursor approaches.
 *
 * When to use:
 * - Portfolio navigation or social‑link toolbar.
 * - Any page where you want to showcase the Dock component with
 *   standard magnification behaviour.
 */

"use client";
import React from "react";
import { Home, Search, Settings } from "lucide-react";
import { Dock, DockIcon } from "@/components/ui/dock";

export default function DockDemo() {
  return (
    <Dock>
      <DockIcon>
        <Home className="size-5" />
      </DockIcon>
      <DockIcon>
        <Search className="size-5" />
      </DockIcon>
      <DockIcon>
        <Settings className="size-5" />
      </DockIcon>
    </Dock>
  );
}
