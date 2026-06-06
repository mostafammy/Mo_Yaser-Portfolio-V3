import type { Metadata } from "next"
import Link from "next/link"
import { experience } from "@/data/experience"
import { STATUS } from "@/data/status"
import { PrintButton } from "@/components/PrintButton"

export const metadata: Metadata = {
  title: "Resume",
  description: "Mostafa Yaser — Full Stack SWE & Global Health Technologist",
}

const CATEGORY_COLOR: Record<string, string> = {
  engineering:      "text-blue-400/70   border-blue-500/20  bg-blue-500/[0.06]",
  "global-health":  "text-emerald-400/70 border-emerald-500/20 bg-emerald-500/[0.06]",
  leadership:       "text-purple-400/70  border-purple-500/20 bg-purple-500/[0.06]",
  entrepreneurship: "text-amber-400/70   border-amber-500/20  bg-amber-500/[0.06]",
}

const ALL_SKILLS = [
  ...new Set(experience.flatMap((e) => e.skills)),
].sort()

export default function ResumePage() {
  const now = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] print:bg-white">
      {/* Top bar */}
      <div className="border-b border-white/[0.06] print:hidden">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-[12px] font-mono text-white/30 hover:text-white/60
                       transition-colors duration-150 flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            mostafayaser.earth
          </Link>
          <PrintButton />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-14 print:py-6 print:px-0">

        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="mb-12 print:mb-8">
          <h1 className="text-[36px] font-semibold tracking-[-0.03em]
                         text-white print:text-black mb-2 leading-tight">
            Mostafa Yaser
          </h1>
          <p className="text-[17px] text-white/45 print:text-gray-500 mb-6">
            Full Stack SWE &amp; Global Health Technologist
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[12px]
                          text-white/35 print:text-gray-500 font-mono">
            <span>Cairo, Egypt</span>
            <span className="text-white/15 print:text-gray-300 hidden sm:inline">·</span>
            <a href="mailto:mostafa.yaser.developer@gmail.com"
               className="hover:text-white/70 transition-colors print:text-gray-500">
              mostafa.yaser.developer@gmail.com
            </a>
            <span className="text-white/15 print:text-gray-300 hidden sm:inline">·</span>
            <a href="https://github.com/mostafammy" target="_blank" rel="noopener noreferrer"
               className="hover:text-white/70 transition-colors print:text-gray-500">
              github.com/mostafammy
            </a>
            <span className="text-white/15 print:text-gray-300 hidden sm:inline">·</span>
            <a href="https://linkedin.com/in/mostafayaser" target="_blank" rel="noopener noreferrer"
               className="hover:text-white/70 transition-colors print:text-gray-500">
              linkedin.com/in/mostafayaser
            </a>
          </div>

          {/* Availability */}
          {STATUS.type !== "unavailable" && (
            <div className="mt-5 print:hidden">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                               bg-emerald-500/[0.08] border border-emerald-500/20
                               text-[12px] text-emerald-400/80">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                {STATUS.label}
              </span>
            </div>
          )}
        </div>

        <Divider />

        {/* ── Summary ──────────────────────────────────────────────── */}
        <Section title="Summary">
          <p className="text-[14px] text-white/55 print:text-gray-600 leading-relaxed">
            Full Stack Software Engineer and Global Health Technologist building at the
            intersection of technology and human impact. Shipped production Next.js
            applications for global mentorship platforms. Directed IFMSA project operations
            across national teams. Selected for McKinsey Forward, Aspire Leader 2025, and
            IFMSA&apos;s international Health Systems Major Working Group. 8+ international
            hackathons across 4 continents — 2nd place at SalamHack 2025.
          </p>
        </Section>

        <Divider />

        {/* ── Experience ───────────────────────────────────────────── */}
        <Section title="Experience">
          <div className="space-y-7">
            {experience.map((item) => (
              <div key={item.id} className="group">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-semibold text-white/85 print:text-black">
                      {item.title}
                    </span>
                    <span className="text-[14px] text-white/35 print:text-gray-500">
                      {item.org}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full border font-medium
                                  ${CATEGORY_COLOR[item.category]}
                                  print:bg-gray-100 print:border-gray-300 print:text-gray-500`}
                    >
                      {item.type}
                    </span>
                  </div>
                  <span className="text-[12px] text-white/25 print:text-gray-400 font-mono flex-shrink-0">
                    {item.period}
                  </span>
                </div>

                <p className="text-[12px] text-white/22 print:text-gray-400 mb-2 font-mono">
                  {item.location}
                </p>

                <p className="text-[13px] text-white/50 print:text-gray-600 leading-relaxed mb-2.5">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {item.skills.map((skill, si) => (
                    <span key={skill} className="text-[11px] text-white/30 print:text-gray-400">
                      {skill}
                      {si < item.skills.length - 1 && (
                        <span className="ml-1.5 text-white/12 print:text-gray-200">·</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* ── Skills ───────────────────────────────────────────────── */}
        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {ALL_SKILLS.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded text-[12px]
                           bg-white/[0.04] border border-white/[0.06] text-white/45
                           print:bg-gray-50 print:border-gray-200 print:text-gray-600"
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <div className="mt-14 pt-5 border-t border-white/[0.05] print:border-gray-200
                        flex items-center justify-between">
          <p className="text-[11px] text-white/18 print:text-gray-400 font-mono">
            mostafayaser.earth · v0.1.0 · {now}
          </p>
          <Link
            href="/"
            className="text-[11px] text-white/18 hover:text-white/50 print:hidden
                       transition-colors font-mono"
          >
            ← back to portfolio
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="py-9 print:py-6">
      <h2 className="text-[10px] tracking-[0.22em] text-white/25 print:text-gray-400
                     uppercase font-medium mb-6">
        {title}
      </h2>
      {children}
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-white/[0.05] print:bg-gray-200" />
}
