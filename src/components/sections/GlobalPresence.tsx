"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import WorldMap from "@/components/ui/world-map"
import { fadeUp } from "@/lib/motion"

// Cairo pushed left so its label clears the nearby Amman dot (only 10px apart on x-axis)
const CAIRO = { lat: 30.044, lng: 31.236, label: "Cairo", labelOffset: { x: -40, y: -7 } }

const DOTS = [
  // Cairo → Copenhagen (IFMSA MWG)
  {
    start: CAIRO,
    end: { lat: 55.676, lng: 12.568, label: "Copenhagen" },
  },
  // Cairo → Espoo (Junction 2025)
  {
    start: CAIRO,
    end: { lat: 60.169, lng: 24.938, label: "Espoo, Finland" },
  },
  // Cairo → Dubai (Create Apps Championship)
  {
    start: CAIRO,
    end: { lat: 25.204, lng: 55.271, label: "Dubai" },
  },
  // Cairo → Amman (SalamHack 2025)
  {
    start: CAIRO,
    end: { lat: 31.953, lng: 35.911, label: "Amman" },
  },
  // Cairo → Fort Mill, SC (IYNA Ideathon)
  {
    start: CAIRO,
    end: { lat: 35.009, lng: -80.94, label: "Fort Mill, SC" },
  },
]

const CITIES = [
  { name: "Cairo",         flag: "🇪🇬", note: "Base",           tooltip: "Home base · all operations start here" },
  { name: "Copenhagen",    flag: "🇩🇰", note: "IFMSA MWG",      tooltip: "IFMSA Health Systems MWG · Jan–Apr 2026" },
  { name: "Espoo, Finland",flag: "🇫🇮", note: "Junction '25",   tooltip: "Junction 2025 Hackathon · Nov 2025" },
  { name: "Dubai",         flag: "🇦🇪", note: "Dubai Chambers", tooltip: "Create Apps Championship · 2025" },
  { name: "Amman",         flag: "🇯🇴", note: "SalamHack 2nd",  tooltip: "SalamHack — 2nd Place Finalist · 2025" },
  { name: "Fort Mill, SC", flag: "🇺🇸", note: "IYNA",           tooltip: "IYNA International Ideathon · 2025" },
]

export function GlobalPresence() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)

  return (
    <section
      id="global-presence"
      className="relative bg-[#0a0a0a] py-28 lg:py-44"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-7"
          >
            <span className="w-5 h-px bg-blue-500/60" />
            <span className="text-[11px] tracking-[0.22em] text-blue-400/70 uppercase font-medium">
              / presence
            </span>
            <span className="w-5 h-px bg-blue-500/60" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={1}
            viewport={{ once: true }}
            className="text-[clamp(32px,5vw,52px)] font-semibold tracking-[-0.03em] text-white mb-4"
          >
            Active across{" "}
            <span className="text-white/40">5 continents.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={2}
            viewport={{ once: true }}
            className="text-[15px] text-white/35 max-w-md mx-auto leading-relaxed"
          >
            Collaborating globally from Cairo — hackathons, health programs,
            and remote engineering across borders.
          </motion.p>
        </div>

        {/* Map */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={3}
          viewport={{ once: true, margin: "-80px" }}
          className="rounded-2xl overflow-hidden border border-white/[0.06]"
        >
          <WorldMap dots={DOTS} lineColor="#3b82f6" />
        </motion.div>

        {/* City chips */}
        <motion.div
          variants={{
            visible: { transition: { staggerChildren: 0.07 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 flex flex-wrap gap-3 justify-center"
        >
          {CITIES.map((city) => (
            <motion.div
              key={city.name}
              variants={fadeUp}
              onHoverStart={() => setHoveredCity(city.name)}
              onHoverEnd={() => setHoveredCity(null)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full cursor-default
                         bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm
                         hover:bg-white/[0.07] hover:border-white/[0.12] transition-colors duration-150"
            >
              <span className="text-[15px] leading-none">{city.flag}</span>
              <span className="text-[13px] text-white/60 font-medium">{city.name}</span>
              <span className="text-[11px] text-white/25">{city.note}</span>

              <AnimatePresence>
                {hoveredCity === city.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.94 }}
                    transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50
                               px-3 py-1.5 rounded-xl whitespace-nowrap pointer-events-none
                               bg-[#1c1c1c] border border-white/[0.08]
                               text-[12px] text-white/55
                               shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
                  >
                    {city.tooltip}
                    {/* Caret */}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px
                                     border-[5px] border-transparent border-t-[#1c1c1c]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
