/**
 * AmbientSoundToggle — The 🔇 / 🔊 ambient audio toggle.
 *
 * Design brief (Principal SWE @ Apple lens):
 *   - 36×36 pill, frosted-glass dark background
 *   - Icon crossfades between muted/active states with spring animation
 *   - Animated waveform bars appear when audio is active — live visual feedback
 *   - Subtle glow pulse on enable
 *   - Tooltip on hover: "Ambient Sound · Off / On"
 *   - Accessible: role="switch", aria-checked, aria-label
 *   - Always visible alongside the dock when dock is visible
 */

"use client"

import { motion, AnimatePresence, useSpring, useTransform } from "motion/react"
import { useAmbientAudioContext } from "@/components/AmbientAudioProvider"
import { useState } from "react"

// ---------------------------------------------------------------------------
// Waveform bar component — three animated bars that breathe when audio is on
// ---------------------------------------------------------------------------

function WaveformBars({ active }: { active: boolean }) {
  const BARS = [
    { delay: 0,    duration: 0.55, minH: 3, maxH: 11 },
    { delay: 0.15, duration: 0.70, minH: 5, maxH: 14 },
    { delay: 0.08, duration: 0.60, minH: 3, maxH: 10 },
  ]

  return (
    <div className="flex items-center gap-[2.5px]" aria-hidden="true">
      {BARS.map((bar, i) => (
        <motion.span
          key={i}
          className="rounded-full bg-current"
          style={{ width: 2 }}
          animate={
            active
              ? {
                  height: [bar.minH, bar.maxH, bar.minH],
                  opacity: [0.7, 1, 0.7],
                }
              : { height: 3, opacity: 0.35 }
          }
          transition={
            active
              ? {
                  duration: bar.duration,
                  delay: bar.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : { duration: 0.25 }
          }
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Muted icon (single bar with diagonal strike)
// ---------------------------------------------------------------------------

function MutedIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Main Toggle
// ---------------------------------------------------------------------------

export function AmbientSoundToggle() {
  const { enabled, toggle } = useAmbientAudioContext()
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  // Scale spring for press feedback
  const scaleSpring = useSpring(1, { stiffness: 500, damping: 28 })
  const scale = useTransform(scaleSpring, (v) => v)

  function handlePress() {
    setPressed(true)
    scaleSpring.set(0.88)
    setTimeout(() => {
      scaleSpring.set(1)
      setPressed(false)
    }, 120)
    toggle()
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, y: 4, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.92 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2
                       px-2.5 py-1.5 rounded-lg whitespace-nowrap pointer-events-none z-[100]
                       bg-[#1a1a1a] border border-white/[0.08]
                       text-[11px] text-white/55 font-medium tracking-wide
                       shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          >
            Ambient Sound · {enabled ? "On" : "Off"}
            {/* Caret */}
            <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-[4px] border-transparent border-t-[#1a1a1a]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        role="switch"
        aria-checked={enabled}
        aria-label={enabled ? "Disable ambient sound" : "Enable ambient sound"}
        style={{ scale }}
        onClick={handlePress}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className={[
          "relative w-9 h-9 rounded-xl flex items-center justify-center",
          "transition-colors duration-200",
          "outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
          enabled
            ? "text-blue-400/90 bg-blue-500/[0.12] border border-blue-500/[0.18]"
            : "text-white/35 bg-white/[0.05] border border-white/[0.07] hover:text-white/60 hover:bg-white/[0.08]",
        ].join(" ")}
      >
        {/* Glow ring on enable */}
        <AnimatePresence>
          {enabled && (
            <motion.span
              key="glow"
              className="absolute inset-0 rounded-xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [1, 1.25, 1],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 70%)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Icon crossfade */}
        <AnimatePresence mode="wait" initial={false}>
          {enabled ? (
            <motion.span
              key="active"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center"
            >
              <WaveformBars active={true} />
            </motion.span>
          ) : (
            <motion.span
              key="muted"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center"
            >
              <MutedIcon />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
