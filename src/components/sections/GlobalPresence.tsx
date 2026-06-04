"use client"

import { motion } from "motion/react"
import WorldMap from "@/components/ui/world-map"
import { fadeUp } from "@/lib/motion"

const DOTS = [
  // Cairo → Copenhagen (IFMSA MWG + Health SWG)
  {
    start: { lat: 30.044, lng: 31.236, label: "Cairo" },
    end: { lat: 55.676, lng: 12.568, label: "Copenhagen" },
  },
  // Cairo → Helsinki (Junction 2025)
  {
    start: { lat: 30.044, lng: 31.236, label: "Cairo" },
    end: { lat: 60.169, lng: 24.938, label: "Helsinki" },
  },
  // Cairo → Dubai (Create Apps Championship)
  {
    start: { lat: 30.044, lng: 31.236, label: "Cairo" },
    end: { lat: 25.204, lng: 55.271, label: "Dubai" },
  },
  // Cairo → Amman (SalamHack 2025)
  {
    start: { lat: 30.044, lng: 31.236, label: "Cairo" },
    end: { lat: 31.953, lng: 35.911, label: "Amman" },
  },
  // Cairo → Fort Mill, SC (IYNA Ideathon)
  {
    start: { lat: 30.044, lng: 31.236, label: "Cairo" },
    end: { lat: 35.009, lng: -80.94, label: "Fort Mill, SC" },
  },
]

const CITIES = [
  { name: "Cairo", flag: "🇪🇬", note: "Base" },
  { name: "Copenhagen", flag: "🇩🇰", note: "2 roles" },
  { name: "Helsinki", flag: "🇫🇮", note: "Junction" },
  { name: "Dubai", flag: "🇦🇪", note: "Finalist" },
  { name: "Amman", flag: "🇯🇴", note: "SalamHack" },
  { name: "Fort Mill, SC", flag: "🇺🇸", note: "IYNA" },
]

export function GlobalPresence() {
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
              className="flex items-center gap-2 px-4 py-2 rounded-full
                         bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm"
            >
              <span className="text-[15px] leading-none">{city.flag}</span>
              <span className="text-[13px] text-white/60 font-medium">
                {city.name}
              </span>
              <span className="text-[11px] text-white/25">{city.note}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
