"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { motion, useInView } from "motion/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { fadeUp } from "@/lib/motion"

gsap.registerPlugin(ScrollTrigger)

// ─── Types ────────────────────────────────────────────────────────────────────

type Day = { date: string; contributionCount: number }
type Week = { contributionDays: Day[] }

type LangItem = { lang: string; count: number }

type FetchState =
  | { status: "loading" }
  | { status: "loaded"; total: number; weeks: Week[]; currentStreak: number; longestStreak: number; languages: LangItem[] }
  | { status: "unconfigured" }
  | { status: "error" }

// ─── Data ─────────────────────────────────────────────────────────────────────

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

const LEGEND = [
  "rgba(255,255,255,0.05)",
  "rgba(59,130,246,0.22)",
  "rgba(59,130,246,0.44)",
  "rgba(59,130,246,0.68)",
  "rgba(34,211,238,0.88)",
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COL_PX = 14  // 12px cell + 2px gap
const DOW_PX = 28  // left column for day-of-week labels
const TOTAL_WEEKS = 53

function parseDow(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d).getDay()
}

function normalizeWeek(week: Week): (Day | null)[] {
  const grid: (Day | null)[] = Array(7).fill(null)
  for (const day of week.contributionDays) {
    grid[parseDow(day.date)] = day
  }
  return grid
}

function cellBg(day: Day | null, skeleton: boolean): string {
  if (skeleton) return "rgba(255,255,255,0.06)"
  if (!day) return "transparent"
  const c = day.contributionCount
  if (c === 0) return "rgba(255,255,255,0.05)"
  if (c <= 2) return "rgba(59,130,246,0.22)"
  if (c <= 5) return "rgba(59,130,246,0.44)"
  if (c <= 9) return "rgba(59,130,246,0.68)"
  return "rgba(34,211,238,0.88)"
}

function cellGlow(day: Day | null): string | undefined {
  if (!day) return undefined
  const c = day.contributionCount
  if (c > 9) return "0 0 6px rgba(34,211,238,0.55)"
  if (c > 5) return "0 0 4px rgba(59,130,246,0.45)"
  return undefined
}

// ─── Contribution Grid ────────────────────────────────────────────────────────

interface GridProps {
  weeks: Week[]
  skeleton?: boolean
}

function ContributionGrid({ weeks, skeleton = false }: GridProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const padded = useMemo(
    () => [
      ...weeks,
      ...Array(Math.max(0, TOTAL_WEEKS - weeks.length)).fill({ contributionDays: [] }),
    ],
    [weeks]
  )

  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = []
    let last = -1
    padded.forEach((week, col) => {
      const first = week.contributionDays[0]
      if (!first) return
      const m = new Date(first.date).getMonth()
      if (m !== last) { labels.push({ label: MONTHS[m], col }); last = m }
    })
    return labels
  }, [padded])

  return (
    <div ref={ref} className="overflow-x-auto">
      {/* Month labels */}
      <div
        className="relative h-5 mb-1 shrink-0"
        style={{ width: DOW_PX + padded.length * COL_PX }}
      >
        {monthLabels.map(({ label, col }) => (
          <span
            key={label}
            className="absolute text-[10px] text-white/25 tracking-wide font-medium select-none"
            style={{ left: DOW_PX + col * COL_PX }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Heatmap rows */}
      <div className="flex gap-[2px]">
        {/* Day-of-week labels */}
        <div className="flex flex-col gap-[2px] shrink-0" style={{ width: DOW_PX }}>
          {["","M","","W","","F",""].map((d, i) => (
            <div
              key={i}
              className="h-3 flex items-center justify-end pr-1.5 text-[9px] text-white/20 select-none"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Week columns */}
        {padded.map((week, wIdx) => {
          const days = normalizeWeek(week)
          return (
            <motion.div
              key={wIdx}
              className="flex flex-col gap-[2px] shrink-0"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: wIdx * 0.011, duration: 0.2 }}
            >
              {days.map((day, dIdx) => (
                <div
                  key={dIdx}
                  title={
                    day
                      ? `${day.date}: ${day.contributionCount} contribution${day.contributionCount !== 1 ? "s" : ""}`
                      : undefined
                  }
                  className={`w-3 h-3 rounded-[2.5px] transition-transform duration-150 hover:scale-125 cursor-default${skeleton ? " animate-pulse" : ""}`}
                  style={{
                    background: cellBg(day, skeleton),
                    boxShadow: cellGlow(day),
                  }}
                />
              ))}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function GitHubContributions() {
  const sectionRef = useRef<HTMLElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const [state, setState] = useState<FetchState>({ status: "loading" })

  useEffect(() => {
    fetch("/api/github-contributions")
      .then((r) => r.json())
      .then((d) => {
        if (d.unconfigured) return setState({ status: "unconfigured" })
        if (d.error) return setState({ status: "error" })
        setState({
          status: "loaded",
          total: d.total,
          weeks: d.weeks ?? [],
          currentStreak: d.currentStreak ?? 0,
          longestStreak: d.longestStreak ?? 0,
          languages: d.languages ?? [],
        })
      })
      .catch(() => setState({ status: "error" }))
  }, [])

  useEffect(() => {
    if (state.status !== "loaded" || !counterRef.current) return
    const total = state.total
    const ctx = gsap.context(() => {
      const obj = { value: 0 }
      gsap.to(obj, {
        value: total,
        duration: 2.4,
        ease: "power2.out",
        onUpdate() {
          if (counterRef.current) {
            counterRef.current.textContent = Math.round(obj.value).toLocaleString()
          }
        },
        scrollTrigger: {
          trigger: counterRef.current,
          start: "top 88%",
          once: true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [state])

  const weeks = state.status === "loaded" ? state.weeks : []

  return (
    <section
      id="contributions"
      ref={sectionRef}
      className="relative bg-[#0a0a0a] py-28 lg:py-44 overflow-hidden"
    >
      {/* Ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 60%, rgba(59,130,246,0.055) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">

        {/* ── Header ─── */}
        <div className="mb-14 lg:mb-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-7"
          >
            <span className="w-5 h-px bg-blue-500/60" />
            <span className="text-[11px] tracking-[0.22em] text-blue-400/70 uppercase font-medium">
              / consistency
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-16">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              custom={1}
              viewport={{ once: true }}
              className="text-[clamp(34px,5.5vw,58px)] font-semibold tracking-[-0.03em] leading-[1.05] text-white"
            >
              ~3,000 contributions
              <br />
              <span className="text-white/35">every year.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              custom={2}
              viewport={{ once: true }}
              className="text-[15px] text-white/40 leading-[1.75] max-w-[300px] lg:text-right shrink-0"
            >
              Committed while directing IFMSA programs
              across 130+ countries, competing on
              4 continents, and shipping production
              systems. The calendar never stopped.
            </motion.p>
          </div>
        </div>

        {/* ── Live 2026 counter ─── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={3}
          viewport={{ once: true }}
          className="mb-8 flex items-center gap-4 flex-wrap"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.07]">
            {state.status === "loaded" ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[13px] text-white/50">
                  <span
                    ref={counterRef}
                    className="text-white/85 font-semibold tabular-nums"
                  >
                    0
                  </span>
                  <span className="ml-1.5">contributions in 2026 so far</span>
                </span>
              </>
            ) : state.status === "loading" ? (
              <>
                <span className="h-2 w-2 rounded-full bg-white/20 animate-pulse" />
                <span className="text-[13px] text-white/30">Fetching 2026 data…</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="text-[13px] text-white/25">
                  {state.status === "unconfigured"
                    ? "Add GITHUB_TOKEN to .env.local to see live data"
                    : "Live data unavailable"}
                </span>
              </>
            )}
          </div>

          {state.status === "loaded" && (
            <span className="text-[11px] text-white/18 tracking-wide">
              Live · GitHub GraphQL API · revalidates hourly
            </span>
          )}
        </motion.div>

        {/* ── Streak stats ─── */}
        {state.status === "loaded" && (state.currentStreak > 0 || state.longestStreak > 0) && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={3.5}
            viewport={{ once: true }}
            className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {[
              { label: "Current streak", value: `${state.currentStreak}d` },
              { label: "Longest streak",  value: `${state.longestStreak}d` },
              { label: "Total 2026",      value: state.total.toLocaleString() },
              { label: "Avg / week",      value: state.weeks.length > 0
                  ? Math.round(state.total / Math.max(1, state.weeks.length)).toString()
                  : "—" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05]"
              >
                <p className="text-[22px] font-semibold text-white/85 tabular-nums leading-none mb-1">
                  {value}
                </p>
                <p className="text-[11px] text-white/28 tracking-wide">{label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Language bar ─── */}
        {state.status === "loaded" && state.languages.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={3.8}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-[10px] tracking-[0.18em] text-white/22 uppercase font-medium mb-3">
              Top languages · public repos
            </p>
            <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
              {(() => {
                const total = state.languages.reduce((s, l) => s + l.count, 0)
                const LANG_COLORS: Record<string, string> = {
                  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
                  "C++": "#f34b7d", Rust: "#dea584", Go: "#00ADD8",
                  CSS: "#563d7c", HTML: "#e34c26", Shell: "#89e051",
                }
                return state.languages.map((l) => (
                  <div
                    key={l.lang}
                    title={`${l.lang} · ${Math.round((l.count / total) * 100)}%`}
                    style={{
                      width: `${(l.count / total) * 100}%`,
                      background: LANG_COLORS[l.lang] ?? "#8b8b8b",
                      opacity: 0.75,
                    }}
                  />
                ))
              })()}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
              {(() => {
                const total = state.languages.reduce((s, l) => s + l.count, 0)
                const LANG_COLORS: Record<string, string> = {
                  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
                  "C++": "#f34b7d", Rust: "#dea584", Go: "#00ADD8",
                  CSS: "#563d7c", HTML: "#e34c26", Shell: "#89e051",
                }
                return state.languages.map((l) => (
                  <div key={l.lang} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: LANG_COLORS[l.lang] ?? "#8b8b8b", opacity: 0.75 }}
                    />
                    <span className="text-[11px] text-white/35">{l.lang}</span>
                    <span className="text-[11px] text-white/18">
                      {Math.round((l.count / total) * 100)}%
                    </span>
                  </div>
                ))
              })()}
            </div>
          </motion.div>
        )}

        {/* ── Heatmap card ─── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={4}
          viewport={{ once: true }}
          className="relative rounded-2xl bg-white/[0.02] border border-white/[0.05] p-5 lg:p-8"
        >
          {/* Inner bottom glow */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 110%, rgba(59,130,246,0.09) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-10">
            <ContributionGrid
              weeks={weeks}
              skeleton={state.status === "loading"}
            />
          </div>

          {/* Legend */}
          <div className="relative z-10 flex items-center justify-between mt-5 pt-4 border-t border-white/[0.04] flex-wrap gap-3">

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] text-white/20">Less</span>
              {LEGEND.map((bg, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-[2px]"
                  style={{ background: bg }}
                />
              ))}
              <span className="text-[10px] text-white/20">More</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
