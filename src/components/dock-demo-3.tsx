/**
 * DockDemoCustomMagnification
 *
 * A dock with exaggerated magnification (iconSize=32, iconMagnification=80)
 * for a more dramatic hover effect. The icons start smaller and grow larger
 * than the default.
 */

"use client";
import React from "react";
import { Home, Search, Settings } from "lucide-react";
import { Dock, DockIcon } from "@/components/ui/dock";

export default function DockDemoCustomMagnification() {
  return (
    <Dock iconSize={32} iconMagnification={80} iconDistance={160}>
      <DockIcon>
        <Home className="size-4" />
      </DockIcon>
      <DockIcon>
        <Search className="size-4" />
      </DockIcon>
      <DockIcon>
        <Settings className="size-4" />
      </DockIcon>
    </Dock>
  );
}
