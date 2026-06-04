"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { experience, type Category } from "@/data/experience"
import { fadeUp } from "@/lib/motion"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

const FILTERS: { label: string; value: Category | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Engineering", value: "engineering" },
  { label: "Global Health", value: "global-health" },
  { label: "Leadership", value: "leadership" },
  { label: "Entrepreneurship", value: "entrepreneurship" },
]

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState<Category | "all">("all")
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered =
    activeFilter === "all"
      ? experience
      : experience.filter((e) => e.category === activeFilter)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            end: "bottom 35%",
            scrub: true,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative bg-[#0a0a0a] py-28 lg:py-44"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 25% 50%, rgba(59,130,246,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-16 relative z-10">
        {/* Section header */}
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
              / experience
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={1}
            viewport={{ once: true }}
            className="text-[clamp(32px,5vw,52px)] font-semibold tracking-[-0.03em]
                       text-white mb-8 leading-[1.05]"
          >
            Two years of building
            <br />
            <span className="text-white/40">across disciplines.</span>
          </motion.h2>

          {/* Filter chips */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={2}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2"
          >
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setActiveFilter(f.value)
                  setExpanded(null)
                }}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200",
                  activeFilter === f.value
                    ? "bg-blue-600 text-white shadow-[0_0_16px_rgba(59,130,246,0.3)]"
                    : "bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/60 hover:border-white/[0.15]"
                )}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical spine */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/[0.06]">
            <div
              ref={lineRef}
              className="w-full h-full bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent"
            />
          </div>

          <AnimatePresence mode="popLayout">
            <div className="space-y-0">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16, transition: { duration: 0.2 } }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative pl-8 pb-3 last:pb-0"
                >
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      "absolute left-[-4.5px] top-[22px] w-2.5 h-2.5 rounded-full border-2 transition-colors duration-200",
                      item.highlight
                        ? "border-blue-500 bg-[#0a0a0a] shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                        : "border-white/[0.15] bg-transparent"
                    )}
                  />

                  <button
                    onClick={() =>
                      setExpanded(expanded === item.id ? null : item.id)
                    }
                    className="w-full text-left"
                  >
                    <div
                      className={cn(
                        "p-5 rounded-xl border transition-all duration-300",
                        item.highlight
                          ? "bg-blue-500/[0.035] border-blue-500/20 hover:border-blue-500/35"
                          : "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1]",
                        expanded === item.id && "!border-white/[0.12]"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-[14px] font-semibold text-white/80">
                              {item.title}
                            </h3>
                            {item.highlight && (
                              <span
                                className="px-2 py-0.5 text-[10px] rounded-full
                                           bg-blue-500/15 text-blue-400
                                           border border-blue-500/25 font-medium"
                              >
                                Key role
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[13px] text-blue-400/70 font-medium">
                              {item.org}
                            </span>
                            <span className="text-white/20 text-xs">·</span>
                            <span className="text-[12px] text-white/30">
                              {item.period}
                            </span>
                            <span className="text-white/20 text-xs">·</span>
                            <span className="text-[12px] text-white/30">
                              {item.location}
                            </span>
                          </div>
                        </div>

                        {item.description && (
                          <motion.div
                            animate={{ rotate: expanded === item.id ? 45 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-white/20 flex-shrink-0 mt-1"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                d="M7 1v12M1 7h12"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </div>

                      <AnimatePresence>
                        {expanded === item.id && item.description && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <p className="mt-4 text-[13px] text-white/40 leading-relaxed border-t border-white/[0.06] pt-4">
                              {item.description}
                            </p>
                            {item.skills.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {item.skills.slice(0, 5).map((skill) => (
                                  <span
                                    key={skill}
                                    className="px-2.5 py-0.5 text-[11px] rounded-full
                                               bg-white/[0.04] border border-white/[0.08]
                                               text-white/40"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="pl-8 py-12 text-center text-white/25 text-sm">
              No entries in this category.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
