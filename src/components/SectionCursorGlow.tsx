"use client"

import { useEffect, useState } from "react"
import { motion, useSpring } from "motion/react"

const SECTION_ACCENTS: Record<string, string> = {
  "hero":            "59,130,246",
  "about":           "59,130,246",
  "story":           "129,140,248",
  "global-presence": "16,185,129",
  "hackathons":      "245,158,11",
  "case-studies":    "6,182,212",
  "contact":         "59,130,246",
}

export function SectionCursorGlow() {
  const [accent, setAccent] = useState("59,130,246")
  const [visible, setVisible] = useState(false)

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
        ([entry]) => { if (entry.isIntersecting) setAccent(SECTION_ACCENTS[id]) },
        { threshold: 0.25 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

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
