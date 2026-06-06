import { STATUS } from "@/data/status"

const DOT: Record<string, string> = {
  open:        "bg-emerald-400",
  sprint:      "bg-amber-400",
  unavailable: "bg-red-400",
}

const PULSE: Record<string, string> = {
  open:        "bg-emerald-400",
  sprint:      "bg-amber-400",
  unavailable: "bg-red-400",
}

export function StatusBadge() {
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                 bg-white/[0.04] border border-white/[0.07]
                 text-[12px] text-white/45 select-none"
    >
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
        {STATUS.type === "open" && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping ${PULSE[STATUS.type]}`}
          />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${DOT[STATUS.type]}`} />
      </span>
      {STATUS.label}
    </span>
  )
}
