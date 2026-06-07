"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView } from "motion/react"
import {
  IconQuestionMark,
  IconSchool,
  IconCode,
  IconHeartHandshake,
  IconTrophy,
  IconUsers,
  IconWorld,
  IconCompass,
} from "@tabler/icons-react"
import { fadeUp } from "@/lib/motion"

/* ─── Data ──────────────────────────────────────────────────── */

type Chapter = {
  year: string
  accent: string
  icon: ReactNode
  title: string
  narrative: string
  pullQuote?: string
  tags: string[]
  bridge: string | null  // label shown in the gap AFTER this chapter
}

const CHAPTERS: Chapter[] = [
  {
    year: "2017",
    accent: "#f97316",
    icon: <IconSchool size={28} stroke={1.8} />,
    title: "The screen stopped being a window.",
    narrative:
      "January to June, computer fundamentals class. We covered file systems, how a browser renders a page, what HTML structures and CSS styles. Nothing spectacular on paper. But for the first time I wasn't just watching a screen — I was beginning to understand what it was made of from the inside. That feeling didn't go away when the semester ended.",
    tags: ["Computer Fundamentals", "HTML", "CSS", "January–June 2017"],
    bridge: "one year before one question changed everything",
  },
  {
    year: "2018",
    accent: "#818cf8",
    icon: <IconQuestionMark size={28} stroke={1.8} />,
    title: "It all started with confusion.",
    narrative:
      "In IT class, my teacher showed us an HTML form — action=\"index.php\". I stopped him mid-sentence: are there files with a .php extension? What do they do differently? He said we didn't have enough time. Class ended. I went home with more questions than I'd ever had about anything, and I didn't sleep until I had at least some answers. That night changed everything.",
    pullQuote: "I went home with more questions than I'd ever had about anything.",
    tags: ["Origin Story", "Cairo, Egypt"],
    bridge: "two years of wondering",
  },
  {
    year: "2020",
    accent: "#3b82f6",
    icon: <IconCode size={28} stroke={1.8} />,
    title: "I didn't start small.",
    narrative:
      "Two years after that PHP question, I shipped a Facebook clone — full social feed, user auth, friend requests, jQuery on the front, PHP and MySQL on the back. Then an eCommerce app. Not tutorials. Not 'hello world.' Real systems, built from scratch, because I still couldn't stop asking how things actually worked under the hood.",
    tags: ["jQuery", "PHP", "MySQL", "Facebook Clone", "eCommerce"],
    bridge: "three years of building in the dark",
  },
  {
    year: "2023",
    accent: "#06b6d4",
    icon: <IconHeartHandshake size={28} stroke={1.8} />,
    title: "I found the intersection.",
    narrative:
      "IFMSA opened a door I didn't know existed. Medical students, across 130+ countries, coordinating global health programs through spreadsheets and email chains. My two worlds — code and impact — were pointing at the same problem. I stopped asking what I wanted to build. I started asking what needed to be built.",
    pullQuote: "I stopped asking what I wanted to build. I started asking what needed to be built.",
    tags: ["IFMSA-Egypt", "SCOME Coordinator", "Global Health"],
    bridge: "one year of testing limits",
  },
  {
    year: "2024",
    accent: "#f59e0b",
    icon: <IconTrophy size={28} stroke={1.8} />,
    title: "Seven hackathons in eighteen months.",
    narrative:
      "Seven competitions. Eighteen months. Four continents. The one that defined the run: SalamHack 2025 — 2nd place, hosted by Jordan Innovation StartUps, April 2025. Competing alongside builders from across the Arab world and placing on the podium was the clearest proof that the approach worked. NASA Space Apps. Junction in Finland. EcoHack. Dubai Chambers. Each one sharpened the same skill: the shape of your thinking under a real deadline.",
    tags: ["2nd Place · SalamHack 2025", "JIS · Jordan", "NASA", "Junction '25", "4 Continents"],
    bridge: "one year of going wider",
  },
  {
    year: "2025",
    accent: "#a855f7",
    icon: <IconUsers size={28} stroke={1.8} />,
    title: "The most important systems are human.",
    narrative:
      "McKinsey Forward. Aspire Leader cohort. Directing IFMSA's Project Support Division. I learned that the hardest engineering problems aren't technical — they're organizational. How you frame a problem determines whether your team can solve it. How you earn trust across cultures determines whether your solution gets used. Leadership isn't separate from engineering. It's the top of the stack.",
    tags: ["McKinsey Forward", "Aspire Leader 2025", "IFMSA Director", "HP LIFE"],
    bridge: "one year of going deeper",
  },
  {
    year: "2026",
    accent: "#10b981",
    icon: <IconWorld size={28} stroke={1.8} />,
    title: "A database schema for health policy.",
    narrative:
      "The IFMSA Major Working Group changed how I see my work. Sitting in strategy sessions with delegates from 30+ countries, restructuring health program frameworks that 130+ NMOs depend on — I kept thinking: this is just systems design. Identify the constraints, restructure the relationships, validate with stakeholders, ship. Finalist at SalamHack 2026 in parallel — the competitive instinct didn't stop. The medium changes. The mental model doesn't.",
    tags: ["IFMSA MWG", "SalamHack 2026 Finalist", "ScholarX SWE", "Enactus Co-Founder"],
    bridge: null,
  },
  {
    year: "Now",
    accent: "#3b82f6",
    icon: <IconCompass size={28} stroke={1.8} />,
    title: "The confusion became a compass.",
    narrative:
      "Everything I build traces back to that IT classroom in 2018 — a question no one had time to answer, and a refusal to let it go. Whether it's building infrastructure for IFMSA, shipping a prototype in 48 hours, or architecting a production system: it always starts the same way. A question, an open browser tab, and the same restlessness that kept me up that first night.",
    pullQuote: "A question no one had time to answer, and a refusal to let it go.",
    tags: ["ScholarX", "IFMSA", "Enactus", "Cairo, Egypt", "Open to Collaborate"],
    bridge: null,
  },
]

/* ─── Chapter block ──────────────────────────────────────────── */

function ChapterBlock({
  chapter,
  index,
  isLast,
  nextAccent,
}: {
  chapter: Chapter
  index: number
  isLast: boolean
  nextAccent: string
}) {
  const blockRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(blockRef, { once: true, margin: "-80px" })

  return (
    <div ref={blockRef} className="relative">
      {/* ── Left spine column ─────────────────────────────── */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center w-14">
        {/* Icon orb */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={
            isInView
              ? {
                  scale: 1,
                  opacity: 1,
                  boxShadow: [
                    `0 0 0px ${chapter.accent}00`,
                    `0 0 32px ${chapter.accent}55`,
                    `0 0 20px ${chapter.accent}35`,
                  ],
                }
              : {}
          }
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${chapter.accent}1a 0%, ${chapter.accent}08 100%)`,
            border: `1px solid ${chapter.accent}30`,
          }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ color: chapter.accent }}
          >
            {chapter.icon}
          </motion.span>
        </motion.div>

        {/* Connecting line to next chapter */}
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0, transformOrigin: "top" }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="flex-1 w-0.5 mt-1"
            style={{
              background: `linear-gradient(to bottom, ${chapter.accent}60 0%, ${nextAccent}30 50%, transparent 100%)`,
              minHeight: "120px",
            }}
          />
        )}
      </div>

      {/* ── Content column ────────────────────────────────── */}
      <div className="pl-20">
        {/* Year badge */}
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.0 }}
          className="flex items-center gap-2 mb-5 pt-3"
        >
          <span
            className="text-[11px] font-semibold tracking-[0.22em] uppercase px-3 py-1 rounded-full"
            style={{
              color: chapter.accent,
              background: chapter.accent + "12",
              border: `1px solid ${chapter.accent}28`,
            }}
          >
            {chapter.year}
          </span>
          {index === CHAPTERS.length - 1 && (
            <span className="text-[11px] text-white/20 tracking-wide">
              Present
            </span>
          )}
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
          animate={
            isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
          }
          transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-[clamp(24px,3.8vw,40px)] font-semibold tracking-[-0.025em]
                     text-white leading-[1.08] mb-5"
        >
          {chapter.title}
        </motion.h3>

        {/* Narrative */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-[15px] lg:text-[16px] text-white/42 leading-[1.8] max-w-2xl"
        >
          {chapter.narrative}
        </motion.p>

        {/* Pull-quote */}
        {chapter.pullQuote && (
          <motion.blockquote
            initial={{ opacity: 0, x: -12 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
            className="mt-6 pl-4 border-l-2 py-0.5"
            style={{ borderColor: chapter.accent + "55" }}
          >
            <p
              className="text-[16px] lg:text-[18px] font-medium leading-[1.55] italic"
              style={{ color: chapter.accent + "cc" }}
            >
              &ldquo;{chapter.pullQuote}&rdquo;
            </p>
          </motion.blockquote>
        )}

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.38, duration: 0.4 }}
          className="flex flex-wrap gap-2 mt-5"
        >
          {chapter.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-[11px] rounded-full font-medium tracking-wide"
              style={{
                color: chapter.accent + "cc",
                background: chapter.accent + "0d",
                border: `1px solid ${chapter.accent}22`,
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Bridge: time elapsed between chapters */}
        {chapter.bridge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="flex items-center gap-4 mt-12 mb-2"
          >
            <div
              className="h-px flex-1 max-w-[60px]"
              style={{
                background: `linear-gradient(to right, transparent, ${chapter.accent}25)`,
              }}
            />
            <span className="text-[11px] text-white/18 tracking-[0.2em] uppercase font-medium">
              {chapter.bridge}
            </span>
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(to right, ${chapter.accent}15, transparent)`,
              }}
            />
          </motion.div>
        )}

        {/* Bottom spacer before next chapter */}
        <div className={chapter.bridge ? "pb-14" : "pb-4"} />
      </div>
    </div>
  )
}

/* ─── Section ────────────────────────────────────────────────── */

export function Story() {
  return (
    <section
      id="story"
      className="relative bg-[#0a0a0a] py-28 lg:py-44 overflow-hidden"
    >
      {/* Ambient background gradients — shift across section */}
      <div
        className="absolute top-0 left-0 right-0 h-[40%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(129,140,248,0.05) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 80% 100%, rgba(59,130,246,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-16 relative z-10">
        {/* ── Section intro ─── */}
        <div className="mb-20 lg:mb-28">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-8"
          >
            <span className="w-5 h-px bg-indigo-500/60" />
            <span className="text-[11px] tracking-[0.22em] text-indigo-400/70 uppercase font-medium">
              / the journey
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={1}
            viewport={{ once: true }}
            className="text-[clamp(36px,7vw,72px)] font-semibold tracking-[-0.035em]
                       text-white leading-[0.97] mb-6"
          >
            It all started
            <br />
            in a classroom,
            <br />
            <span className="text-white/35">in 2017.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={2}
            viewport={{ once: true }}
            className="text-[16px] text-white/30 max-w-md leading-relaxed"
          >
            Nine years. Eight chapters. One question that{" "}
            hasn&apos;t changed.
          </motion.p>
        </div>

        {/* ── Timeline chapters ─── */}
        <div className="relative">
          {/* Faint full-height spine backdrop */}
          <div className="absolute left-7 top-0 bottom-0 w-px bg-white/[0.04]" />

          {CHAPTERS.map((chapter, i) => (
            <ChapterBlock
              key={chapter.year}
              chapter={chapter}
              index={i}
              isLast={i === CHAPTERS.length - 1}
              nextAccent={CHAPTERS[i + 1]?.accent ?? chapter.accent}
            />
          ))}
        </div>

        {/* ── Closing line ─── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="pl-20 mt-16"
        >
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 max-w-[40px] bg-blue-500/30" />
            <span className="text-[13px] text-white/25 italic">
              and the next chapter is still being written.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
