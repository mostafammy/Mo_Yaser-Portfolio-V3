/**
 * Lens
 *
 * An interactive zoom‑lens component. Wraps any content (image, text, canvas)
 * and magnifies the area under the cursor via a CSS mask‑based "lens" overlay.
 *
 * When to use:
 * - Product / portfolio image galleries where users should inspect detail.
 * - Before‑/after‑comparisons or design mockups that benefit from a
 *   magnifying‑glass interaction.
 * - Case‑study hero images where you want an engaging "hover to zoom" feel.
 *
 * Props:
 *   children          — content to magnify.
 *   zoomFactor?: number          — magnification scale (default 1.3, must be >1).
 *   lensSize?: number            — lens diameter in px (default 170).
 *   position?: Position          — fixed lens position (for controlled usage).
 *   defaultPosition?: Position   — starting position when not hovering.
 *   isStatic?: boolean           — keep lens at `position` always.
 *   duration?: number            — enter/exit animation seconds (default 0.1).
 *   lensColor?: string           — CSS colour for the mask (default "black").
 *   ariaLabel?: string           — accessibility label (default "Zoom Area").
 *
 * Behaviours:
 *   - Default: lens follows cursor on hover, hidden otherwise.
 *   - isStatic: lens is always visible at `position` (no hover logic).
 *   - defaultPosition: lens starts at that position, snaps to cursor on hover,
 *     returns when not hovering.
 */

"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionTemplate } from "motion/react";

interface Position {
  x: number;
  y: number;
}

interface LensProps {
  children: React.ReactNode;
  zoomFactor?: number;
  lensSize?: number;
  position?: Position;
  defaultPosition?: Position;
  isStatic?: boolean;
  duration?: number;
  lensColor?: string;
  ariaLabel?: string;
}

export function Lens({
  children,
  zoomFactor = 1.3,
  lensSize = 170,
  isStatic = false,
  position = { x: 0, y: 0 },
  defaultPosition,
  duration = 0.1,
  lensColor = "black",
  ariaLabel = "Zoom Area",
}: LensProps) {
  if (zoomFactor < 1) {
    throw new Error("zoomFactor must be greater than 1");
  }
  if (lensSize < 0) {
    throw new Error("lensSize must be greater than 0");
  }

  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState<Position>(position);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPosition = useMemo(() => {
    if (isStatic) return position;
    if (defaultPosition && !isHovering) return defaultPosition;
    return mousePosition;
  }, [isStatic, position, defaultPosition, isHovering, mousePosition]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [],
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsHovering(false);
  }, []);

  const maskImage = useMotionTemplate`radial-gradient(circle ${
    lensSize / 2
  }px at ${currentPosition.x}px ${
    currentPosition.y
  }px, ${lensColor} 100%, transparent 100%)`;

  const LensContent = useMemo(() => {
    const { x, y } = currentPosition;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.58 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration }}
        className="absolute inset-0 overflow-hidden"
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
          transformOrigin: `${x}px ${y}px`,
          zIndex: 50,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${zoomFactor})`,
            transformOrigin: `${x}px ${y}px`,
          }}
        >
          {children}
        </div>
      </motion.div>
    );
  }, [currentPosition, maskImage, zoomFactor, children, duration]);

  return (
    <div
      ref={containerRef}
      className="relative z-20 overflow-hidden rounded-xl"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      {children}
      {isStatic || defaultPosition ? (
        LensContent
      ) : (
        <AnimatePresence mode="popLayout">
          {isHovering && LensContent}
        </AnimatePresence>
      )}
    </div>
  );
}
