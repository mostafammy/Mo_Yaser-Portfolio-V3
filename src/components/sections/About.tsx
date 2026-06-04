"use client"

import { useRef, useEffect } from "react"
import { motion } from "motion/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { fadeUp, scaleIn } from "@/lib/motion"
import { GlowingEffect } from "@/components/ui/glowing-effect"

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  {
    icon: "◈",
    title: "Engineer by discipline",
    body: "Full Stack with a focus on frontend architecture, performance, and developer experience. React, Next.js, TypeScript — production quality.",
    tags: ["React", "Next.js", "TypeScript"],
  },
  {
    icon: "◎",
    title: "Global health, technically",
    body: "Selected for IFMSA's international Major Working Group restructuring health frameworks across 130+ National Member Organizations worldwide.",
    tags: ["IFMSA", "Global Health", "Systems Design"],
  },
  {
    icon: "◇",
    title: "Builder, not just coder",
    body: "Co-Founded Enactus New Valley. 7 international hackathons across 4 continents — including 2nd place at SalamHack 2025, Jordan Innovation StartUps.",
    tags: ["Enactus", "Hackathons", "SalamHack 2nd Place"],
  },
  {
    icon: "◉",
    title: "Aspire Leader 2025",
    body: "Organizational leadership cohort — Aspire Institute. Managing IFMSA-Egypt's Project Support Division across national teams.",
    tags: ["Leadership", "IFMSA", "Aspire Institute"],
  },
]

const COUNTER_ITEMS = [
  { target: 130, suffix: "+", label: "Countries reached" },
  { target: 2, suffix: " yrs", label: "IFMSA leadership" },
  { target: 7, suffix: "+", label: "Hackathons · 1 win" },
]

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      COUNTER_ITEMS.forEach(({ target, suffix }, i) => {
        const el = counterRefs.current[i]
        if (!el) return
        const obj = { value: 0 }
        gsap.to(obj, {
          value: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(obj.value) + suffix
          },
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-[#0a0a0a] py-28 lg:py-44 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.35fr] gap-16 lg:gap-28 items-start">
          {/* Left — sticky panel */}
          <div className="lg:sticky lg:top-32 lg:self-start space-y-10 z-20 bg-[#0a0a0a]/80 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none py-4 lg:py-0">
            <div>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center gap-2 mb-7"
              >
                <span className="w-5 h-px bg-blue-500/60" />
                <span className="text-[11px] tracking-[0.22em] text-blue-400/70 uppercase font-medium">
                  / about
                </span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                custom={1}
                viewport={{ once: true }}
                className="text-[clamp(34px,5vw,54px)] font-semibold tracking-[-0.03em]
                           leading-[1.05] text-white"
              >
                I build systems
                <br />
                <span className="text-white/40">that scale across</span>
                <br />
                borders.
              </motion.h2>
            </div>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              custom={2}
              viewport={{ once: true }}
              className="text-[15px] text-white/40 leading-relaxed max-w-sm"
            >
              From restructuring global health programs for 130+ countries to
              shipping production web applications, I operate where technical
              precision meets human impact.
            </motion.p>

            {/* Counters */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              custom={3}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-white/[0.06]"
            >
              {COUNTER_ITEMS.map(({ suffix, label }, i) => (
                <div key={label}>
                  <div className="text-3xl font-semibold text-white tabular-nums">
                    <span
                      ref={(el) => {
                        counterRefs.current[i] = el
                      }}
                    >
                      0{suffix}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/30 mt-1.5 leading-snug">
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — scrolling cards */}
          <div className="space-y-4 lg:space-y-6 z-10 pt-4 lg:pt-0">
            {CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                custom={i}
                viewport={{ once: true, margin: "-60px" }}
                className="group relative p-6 rounded-2xl
                           bg-white/[0.025] border border-white/[0.06]
                           transition-all duration-300 cursor-default"
              >
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="relative z-10 flex items-start gap-4">
                  <span className="text-xl text-blue-500/55 mt-0.5 flex-shrink-0 font-mono">
                    {card.icon}
                  </span>
                  <div className="space-y-2 min-w-0">
                    <h3 className="text-[15px] font-semibold text-white/80">
                      {card.title}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                      {card.body}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 text-[11px] rounded-full
                                     bg-white/[0.04] border border-white/[0.08]
                                     text-white/40 tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
