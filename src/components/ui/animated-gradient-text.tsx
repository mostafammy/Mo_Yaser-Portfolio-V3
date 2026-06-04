/** 
 * AnimatedGradientText
 *
 * Renders text with a moving gradient background clipped to the text
 * via `bg-clip-text`. The gradient animates via the `animate-gradient`
 * utility to create a flowing color sweep effect.
 *
 * When to use:
 * - Headings, badges, or inline labels that need a vibrant "premium" feel
 * - Pair with a pill/badge container for "New", "Introducing", "Pro" labels
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradientText({
  children,
  className,
  ...props
}: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        "animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:300%_100%] bg-clip-text text-transparent",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
