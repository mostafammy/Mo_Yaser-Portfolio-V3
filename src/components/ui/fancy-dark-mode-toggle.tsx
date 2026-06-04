/**
 * FancyDarkModeToggle
 *
 * An immersive, animated dark‑mode toggle built on top of ThemeProvider.
 * The track slides the thumb left (light) ↔ right (dark) with a sun /
 * starry‑night motif and decorative floating star icons.
 *
 * WHEN TO USE:
 *   - Drop into any nav bar, header, settings panel, or floating widget
 *     where you want a delightful theme‑switching experience.
 *   - Requires <ThemeProvider> in an ancestor (usually root layout).
 *   - Fully responsive — scale via `className` prop (default: w-28).
 *   - Works with both explicit user choice and system `prefers-color-scheme`.
 *
 * PROPS:
 *   className?: string  — additional classes on the outer button (track).
 *                         Useful for positioning (e.g. "fixed top-4 right-4 z-50").
 *
 * ANIMATION:
 *   Framer Motion spring‑based thumb slide, star entrance/exit, and
 *   icon rotation. All interactions are accessible via keyboard.
 *
 * ACCESSIBILITY:
 *   - aria‑label updates dynamically: "Switch to dark mode" / "Switch to light mode".
 *   - Keyboard activatable via Enter/Space.
 *   - Focus‑visible ring for keyboard navigation.
 */

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";

type FancyDarkModeToggleProps = {
  className?: string;
};

function StarIcon({
  className,
  size = "1em",
}: {
  className?: string;
  size?: string;
}) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 16 16"
      height={size}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1.25em"
      width="1.25em"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height="1.15em"
      width="1.15em"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const decorativeStars = [
  { cx: "right-2.5", cy: "bottom-1", scale: 1 },
  { cx: "left-1", cy: "bottom-4", scale: 1 },
  { cx: "right-2", cy: "top-2", scale: 0.85 },
];

const floatingStars = [
  { x: "right-8", y: "top-4", rot: -45, scale: 0.82, delay: 0 },
  { x: "right-3", y: "top-9", rot: 45, scale: 0.78, delay: 0.1 },
  { x: "right-10", y: "top-2", rot: 0, scale: 0.9, delay: 0.05 },
];

export default function FancyDarkModeToggle({
  className,
}: FancyDarkModeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const trackGradient = isDark
    ? "from-indigo-600 to-indigo-400"
    : "from-amber-400 to-orange-500";

  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className={`group relative flex w-28 items-center rounded-full p-2 shadow-lg transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${className ?? ""}`}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute inset-0 rounded-full bg-gradient-to-b ${trackGradient}`}
      />

      <AnimatePresence mode="wait">
        {isDark &&
          floatingStars.map((s, i) => (
            <motion.span
              key={`float-star-${i}`}
              initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
              animate={{
                opacity: 1,
                scale: s.scale,
                rotate: s.rot,
                transition: { delay: s.delay, duration: 0.35 },
              }}
              exit={{ opacity: 0, scale: 0, rotate: 0, transition: { duration: 0.2 } }}
              className={`absolute ${s.x} ${s.y} text-slate-300`}
              aria-hidden
            >
              <StarIcon />
            </motion.span>
          ))}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isDark && (
          <motion.span
            key="sun-icon"
            initial={{ opacity: 0, scale: 0, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 90 }}
            transition={{ duration: 0.3 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-200"
            aria-hidden
          >
            <SunIcon />
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isDark && (
          <motion.span
            key="moon-icon"
            initial={{ opacity: 0, scale: 0, rotate: 90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: -90 }}
            transition={{ duration: 0.3 }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-200"
            aria-hidden
          >
            <MoonIcon />
          </motion.span>
        )}
      </AnimatePresence>

      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`relative z-10 h-10 w-10 overflow-hidden rounded-full shadow-lg ${isDark ? "ml-auto" : "mr-auto"}`}
      >
        <div
          className={`absolute inset-0 ${isDark ? "bg-slate-900" : "bg-white"}`}
        />

        {isDark ? (
          <>
            {decorativeStars.map((s, i) => (
              <motion.div
                key={`thumb-star-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute ${s.cx} ${s.cy} rounded-full bg-slate-300`}
                style={{
                  width: s.scale * 12,
                  height: s.scale * 12,
                }}
                aria-hidden
              />
            ))}
          </>
        ) : (
          <motion.div
            key="thumb-sun"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 grid place-items-center text-amber-500"
            aria-hidden
          >
            <SunIcon />
          </motion.div>
        )}
      </motion.div>
    </button>
  );
}
