"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useLenis } from "@/components/lenis-provider"

const SECTIONS = [
  { key: "1", label: "Hero",            id: "hero" },
  { key: "2", label: "About",           id: "about" },
  { key: "3", label: "Story",           id: "story" },
  { key: "4", label: "Global Presence", id: "global-presence" },
  { key: "5", label: "Hackathons",      id: "hackathons" },
  { key: "6", label: "Case Studies",    id: "case-studies" },
  { key: "7", label: "Contact",         id: "contact" },
]

export function KeyboardNav() {
  const [open, setOpen] = useState(false)
  const lenis = useLenis()

  const scrollToSection = useCallback((id: string) => {
    if (lenis) {
      lenis.scrollTo(`#${id}`)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [lenis])

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) return

      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setOpen((prev) => !prev)
        return
      }
      if (e.key === "Escape") {
        setOpen(false)
        return
      }
      const section = SECTIONS.find((s) => s.key === e.key)
      if (section && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        scrollToSection(section.id)
        setOpen(false)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [scrollToSection])

  return (
    <>
      {/* Persistent ? hint beside the command palette badge */}
      <div className="fixed bottom-[26px] right-[200px] z-40 hidden md:flex items-center gap-1.5
                      pointer-events-none select-none">
        <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.06]
                        text-[10px] font-mono text-white/18">
          ?
        </kbd>
        <span className="text-[10px] text-white/15 tracking-wide">shortcuts</span>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="kbd-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div
              key="kbd-panel"
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[18%] left-1/2 -translate-x-1/2 z-[201]
                         w-full max-w-sm bg-[#111111] border border-white/[0.08]
                         rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <p className="text-[11px] tracking-[0.18em] text-white/30 uppercase font-medium">
                  Keyboard shortcuts
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="w-5 h-5 flex items-center justify-center rounded
                             text-white/20 hover:text-white/50 hover:bg-white/[0.06]
                             transition-colors duration-100"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                       strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-3 py-3 space-y-0.5">
                <p className="px-2 py-1.5 text-[10px] tracking-[0.15em] text-white/20 uppercase font-medium">
                  Navigate
                </p>
                {SECTIONS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => { scrollToSection(s.id); setOpen(false) }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg
                               hover:bg-white/[0.04] transition-colors duration-100 text-left group"
                  >
                    <span className="text-[13px] text-white/55 group-hover:text-white/85 transition-colors duration-100">
                      {s.label}
                    </span>
                    <kbd className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.07]
                                    text-[11px] font-mono text-white/30">
                      {s.key}
                    </kbd>
                  </button>
                ))}

                <div className="h-px bg-white/[0.05] my-2 mx-2" />

                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-[13px] text-white/30">Toggle shortcuts</span>
                  <kbd className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.07]
                                  text-[11px] font-mono text-white/30">
                    ?
                  </kbd>
                </div>
                <div className="flex items-center justify-between px-3 py-2 mb-1">
                  <span className="text-[13px] text-white/30">Dismiss</span>
                  <kbd className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.07]
                                  text-[11px] font-mono text-white/30">
                    Esc
                  </kbd>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
