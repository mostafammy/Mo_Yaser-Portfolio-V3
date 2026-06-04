"use client"

import { useRef } from "react"
import { motion } from "motion/react"
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
            7 international hackathons across 4 continents in under 18
            months — 3 finalist positions.
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

  const fireConfetti = () => {
    if (item.result !== "Finalist") return
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
      <CometCard className="h-full" rotateDepth={10} translateDepth={10}>
        <div
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]
                     h-full min-h-[192px] flex flex-col justify-between"
        >
          {/* Top */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-4">
              <span className="text-[26px] leading-none">{item.badge}</span>
              {item.result === "Finalist" ? (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                             bg-amber-500/15 border border-amber-500/25
                             text-[11px] font-semibold text-amber-400"
                >
                  ★ Finalist
                </span>
              ) : (
                <span className="text-[11px] text-white/25 font-medium mt-0.5">
                  {item.result}
                </span>
              )}
            </div>

            <h3 className="text-[14px] font-semibold text-white/75 leading-snug mb-1.5">
              {item.name}
            </h3>
            <p className="text-[12px] text-white/35 leading-snug line-clamp-2">
              {item.org}
            </p>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.05]">
            <span className="text-[11px] text-white/20">{item.period}</span>
            <span
              className="px-2 py-0.5 text-[10px] rounded-full
                         bg-white/[0.04] border border-white/[0.08] text-white/30"
            >
              {item.category}
            </span>
          </div>
        </div>
      </CometCard>
    </motion.div>
  )
}
