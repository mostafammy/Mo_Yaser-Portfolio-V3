"use client"

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                 bg-white/[0.05] border border-white/[0.09]
                 text-[13px] text-white/50 hover:text-white/80 hover:bg-white/[0.08]
                 transition-colors duration-150 font-medium"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M6 9V2h12v7" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect width="12" height="8" x="6" y="14" rx="1" />
      </svg>
      Print / Save PDF
    </button>
  )
}
