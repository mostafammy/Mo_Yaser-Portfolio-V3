"use client"

import { useEffect, useState } from "react"
import { motion, useSpring } from "motion/react"

import { useCursorTheme, type CursorTheme } from "@/context/CursorContext"

const SECTION_ACCENTS: Record<string, { accent: string, theme: CursorTheme }> = {
  "hero":            { accent: "59,130,246", theme: "hero" },
  "about":           { accent: "59,130,246", theme: "about" },
  "story":           { accent: "129,140,248", theme: "story" },
  "contributions":   { accent: "34,211,238", theme: "github" },
  "global-presence": { accent: "16,185,129", theme: "global-presence" },
  "hackathons":      { accent: "245,158,11", theme: "hackathons" },
  "case-studies":    { accent: "6,182,212", theme: "case-studies" },
  "contact":         { accent: "59,130,246", theme: "contact" },
}

export function SectionCursorGlow() {
  const [accent, setAccent] = useState("59,130,246")
  const [visible, setVisible] = useState(false)
  const { setActiveTheme } = useCursorTheme()

  const cursorX = useSpring(0, { damping: 30, stiffness: 180, mass: 0.6 })
  const cursorY = useSpring(0, { damping: 30, stiffness: 180, mass: 0.6 })

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (e.pointerType === "touch") return
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!visible) setVisible(true)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [cursorX, cursorY, visible])

  useEffect(() => {
    const ids = Object.keys(SECTION_ACCENTS)
    const observers: IntersectionObserver[] = []

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { 
          if (entry.isIntersecting) {
            const config = SECTION_ACCENTS[id]
            if (config) {
              setAccent(config.accent)
              setActiveTheme(config.theme)
            }
          } 
        },
        { threshold: 0.25 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [setActiveTheme])

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[1] hidden md:block
                 w-[560px] h-[560px] rounded-full blur-[120px] mix-blend-screen"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        background: `radial-gradient(circle, rgba(${accent},0.07) 0%, transparent 70%)`,
        opacity: visible ? 1 : 0,
        // CSS transition for background colour cross-fade
        transition: "background 0.9s ease, opacity 0.4s ease",
      }}
    />
  )
}
