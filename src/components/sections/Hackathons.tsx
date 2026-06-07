"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { CometCard } from "@/components/ui/comet-card"
import { hackathons } from "@/data/hackathons"
import { fadeUp, scaleIn } from "@/lib/motion"
import confetti from "canvas-confetti"

export function Hackathons() {
  return (
    <section
      id="hackathons"
      className="relative bg-[#0a0a0a] py-28 lg:py-44"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 70% 28%, rgba(139,92,246,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-7"
          >
            <span className="w-5 h-px bg-blue-500/60" />
            <span className="text-[11px] tracking-[0.22em] text-blue-400/70 uppercase font-medium">
              / recognition
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={1}
            viewport={{ once: true }}
            className="text-[clamp(32px,5vw,52px)] font-semibold tracking-[-0.03em]
                       text-white mb-4 leading-[1.05]"
          >
            Competing at the
            <br />
            <span className="text-white/40">global frontier.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={2}
            viewport={{ once: true }}
            className="text-[15px] text-white/35 max-w-md"
          >
            9 hackathons across 4 continents —{" "}
            <span className="text-amber-400/80 font-medium">
              2nd place at SalamHack 2025
            </span>
            {" "}(JIS, Jordan), 3 finalist positions.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {hackathons.map((h, i) => (
            <HackathonCard key={h.name} item={h} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function HackathonCard({
  item,
  index,
}: {
  item: (typeof hackathons)[0]
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)

  const fireConfetti = () => {
    if (item.result !== "Finalist" && item.result !== "2nd Place") return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    confetti({
      particleCount: 28,
      spread: 50,
      startVelocity: 18,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: rect.top / window.innerHeight,
      },
      colors: ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981"],
      ticks: 55,
      gravity: 0.9,
    })
  }

  return (
    <motion.div
      ref={cardRef}
      variants={scaleIn}
      custom={index}
      onMouseEnter={fireConfetti}
    >
      <CometCard className="h-full" rotateDepth={expanded ? 0 : 10} translateDepth={expanded ? 0 : 10}>
        <div
          className={`p-5 rounded-2xl h-full flex flex-col justify-between cursor-pointer
            transition-colors duration-200 ${
              item.result === "2nd Place"
                ? "bg-amber-500/[0.06] border border-amber-400/30 hover:bg-amber-500/[0.09]"
                : "bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05]"
            }`}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {/* Top */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-4">
              <span className="text-[26px] leading-none">{item.badge}</span>
              <div className="flex items-center gap-1.5">
                {item.result === "2nd Place" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                   bg-amber-400/20 border border-amber-400/40
                                   text-[11px] font-bold text-amber-300 tracking-wide">
                    ★★ 2nd Place
                  </span>
                ) : item.result === "Finalist" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                                   bg-amber-500/15 border border-amber-500/25
                                   text-[11px] font-semibold text-amber-400">
                    ★ Finalist
                  </span>
                ) : (
                  <span className="text-[11px] text-white/25 font-medium mt-0.5">
                    {item.result}
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-[14px] font-semibold text-white/75 leading-snug mb-1.5">
              {item.name}
            </h3>
            <p className="text-[12px] text-white/35 leading-snug line-clamp-2">
              {item.org}
            </p>

            {/* Expanded content */}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="expanded"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 pb-1 space-y-2.5">
                    {item.description && (
                      <p className="text-[12px] text-white/45 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 text-[11px] text-white/25">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                           strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      Team of {item.teamSize ?? "—"}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/25">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                           strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {item.location}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.05]">
            <span className="text-[11px] text-white/20">{item.period}</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] rounded-full
                               bg-white/[0.04] border border-white/[0.08] text-white/30">
                {item.category}
              </span>
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.22 }}
                className="text-white/20"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </motion.span>
            </div>
          </div>
        </div>
      </CometCard>
    </motion.div>
  )
}
