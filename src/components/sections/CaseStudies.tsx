"use client"

import { useRef, useEffect } from "react"
import { motion } from "motion/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { fadeUp } from "@/lib/motion"

gsap.registerPlugin(ScrollTrigger)

const CASES = [
  {
    id: "scholarx",
    number: "01",
    category: "Engineering · Full Stack",
    title: "Building for scholars at scale",
    subtitle: "ScholarX mentorship platform — production frontend architecture",
    problem:
      "Scholars needed a reliable, fast platform to connect with mentors across time zones. The existing solution was brittle and slow.",
    approach:
      "Re-architecting the frontend using Next.js App Router, implementing optimistic UI patterns, and focusing on Time-to-Interactive performance and developer experience.",
    insight:
      "Good engineering is invisible — the system just works, and the user never thinks about the infrastructure.",
    tags: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
    gradientFrom: "rgba(59,130,246,0.08)",
    accent: "#3b82f6",
  },
  {
    id: "ifmsa-mwg",
    number: "02",
    category: "Global Health · Systems Design",
    title: "Redesigning for 130+ countries",
    subtitle: "IFMSA Health Systems Program Renewal — Strategic Architecture",
    problem:
      "IFMSA's Health Systems program descriptions were misaligned with global priorities. 130+ National Member Organizations couldn't effectively enroll or adapt programs to local contexts.",
    approach:
      "Selected for the international Major Working Group. Restructured framework descriptions in collaboration with global leadership, aligning programs with WHO priorities and regional NMO needs.",
    insight:
      "The skills are identical: understand the system, find the constraints, redesign the architecture. Whether the system is a codebase or a global health program.",
    tags: ["Program Strategy", "Global Health", "Policy", "Systems Thinking"],
    gradientFrom: "rgba(139,92,246,0.08)",
    accent: "#8b5cf6",
  },
  {
    id: "enactus",
    number: "03",
    category: "Entrepreneurship · Brand Strategy",
    title: "A brand that moves people",
    subtitle: "Enactus New Valley — brand identity from zero to competition",
    problem:
      "A social enterprise chapter with no visual identity, no brand consistency, and no narrative framework for pitching to national stakeholders.",
    approach:
      "Co-Founded the chapter and built the complete visual identity system — brand guidelines, tone of voice, and presentation templates used in Enactus national competitions.",
    insight:
      "Brand is trust made visible. When your visual identity is coherent, people believe your mission is coherent too.",
    tags: [
      "Brand Identity",
      "Visual Design",
      "Entrepreneurship",
      "Leadership",
    ],
    gradientFrom: "rgba(16,185,129,0.08)",
    accent: "#10b981",
  },
]

export function CaseStudies() {
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add("(min-width: 1024px)", () => {
      if (!pinRef.current || !trackRef.current) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          pin: true,
          scrub: 1,
          end: () =>
            `+=${(trackRef.current?.scrollWidth ?? 0) - window.innerWidth}`,
          snap: {
            snapTo: 1 / (CASES.length - 1),
            duration: { min: 0.2, max: 0.5 },
            ease: "power2.inOut",
          },
          invalidateOnRefresh: true,
        },
      })

      tl.to(trackRef.current, {
        x: () =>
          -((trackRef.current?.scrollWidth ?? 0) - window.innerWidth),
        ease: "none",
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="case-studies" className="relative bg-[#0a0a0a]">
      {/* Non-pinned section header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-28 lg:pt-44 pb-14">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center gap-2 mb-7"
        >
          <span className="w-5 h-px bg-blue-500/60" />
          <span className="text-[11px] tracking-[0.22em] text-blue-400/70 uppercase font-medium">
            / case studies
          </span>
        </motion.div>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={1}
          viewport={{ once: true }}
          className="text-[clamp(32px,5vw,52px)] font-semibold tracking-[-0.03em]
                     text-white leading-[1.05]"
        >
          Not what I built —
          <br />
          <span className="text-white/40">how I think.</span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={2}
          viewport={{ once: true }}
          className="mt-4 text-[15px] text-white/35 max-w-lg hidden lg:block"
        >
          Scroll horizontally through three case studies spanning engineering,
          global health policy, and entrepreneurship.
        </motion.p>
      </div>

      {/* Horizontal scroll container — desktop */}
      <div ref={pinRef} className="hidden lg:block h-screen overflow-hidden">
        <div ref={trackRef} className="flex h-full">
          {CASES.map((c) => (
            <div
              key={c.id}
              className="case-panel flex-shrink-0 w-screen h-full
                         flex items-center px-16"
            >
              <div className="max-w-2xl w-full">
                <CaseCard item={c} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical stack */}
      <div className="lg:hidden px-6 pb-28 space-y-5">
        {CASES.map((c, i) => (
          <motion.div
            key={c.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={i}
            viewport={{ once: true }}
          >
            <CaseCard item={c} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function CaseCard({ item }: { item: (typeof CASES)[0] }) {
  return (
    <div
      className="p-8 lg:p-10 rounded-3xl border border-white/[0.07] backdrop-blur-sm"
      style={{
        background: `linear-gradient(135deg, ${item.gradientFrom} 0%, transparent 60%)`,
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <span className="text-[11px] tracking-[0.2em] text-white/30 uppercase font-medium">
          {item.category}
        </span>
        <span className="text-5xl font-bold text-white/[0.06] tabular-nums leading-none">
          {item.number}
        </span>
      </div>

      <h3
        className="text-[clamp(22px,3vw,30px)] font-semibold tracking-[-0.02em]
                   text-white mb-2 leading-[1.1]"
      >
        {item.title}
      </h3>
      <p className="text-[13px] text-white/40 mb-8">{item.subtitle}</p>

      <div className="space-y-5">
        <div>
          <div className="text-[10px] tracking-[0.18em] text-white/25 uppercase mb-2 font-medium">
            Problem
          </div>
          <p className="text-[14px] text-white/55 leading-relaxed">
            {item.problem}
          </p>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.18em] text-white/25 uppercase mb-2 font-medium">
            Approach
          </div>
          <p className="text-[14px] text-white/55 leading-relaxed">
            {item.approach}
          </p>
        </div>
      </div>

      <blockquote
        className="mt-6 pl-4 border-l-2 text-[14px] italic text-white/35 leading-relaxed"
        style={{ borderColor: item.accent + "55" }}
      >
        {item.insight}
      </blockquote>

      <div className="flex flex-wrap gap-2 mt-6">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-[11px] rounded-full
                       bg-white/[0.04] border border-white/[0.08] text-white/40"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
