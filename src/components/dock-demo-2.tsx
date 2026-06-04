/**
 * DockDemoCustomDirection
 *
 * A dock aligned to the top of the container (direction="top").
 * Useful for header‑style navigation bars where the dock sits at the
 * top edge rather than centred vertically.
 */

"use client";
import React from "react";
import { Home, Search, Settings } from "lucide-react";
import { Dock, DockIcon } from "@/components/ui/dock";

export default function DockDemoCustomDirection() {
  return (
    <Dock direction="top">
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
