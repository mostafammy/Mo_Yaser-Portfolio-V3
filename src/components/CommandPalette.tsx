"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"

// ─── Icons ───────────────────────────────────────────────────────────────────

const Icon = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  copy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green-400">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
}

// ─── Data ────────────────────────────────────────────────────────────────────

interface Command {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  action: () => void
  group: "Navigate" | "Connect" | "Actions"
  keywords?: string[]
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

const COMMANDS: Command[] = [
  { id: "nav-hero",    label: "Go to Home",           group: "Navigate", icon: Icon.home,    action: () => scrollTo("hero") },
  { id: "nav-about",   label: "Go to About",           group: "Navigate", icon: Icon.user,    action: () => scrollTo("about") },
  { id: "nav-story",   label: "Go to Journey",         group: "Navigate", icon: Icon.book,    action: () => scrollTo("story"),           keywords: ["experience", "timeline", "career"] },
  { id: "nav-global",  label: "Go to Global Presence", group: "Navigate", icon: Icon.globe,   action: () => scrollTo("global-presence"), keywords: ["map", "world", "globe", "countries"] },
  { id: "nav-work",    label: "Go to Case Studies",    group: "Navigate", icon: Icon.folder,  action: () => scrollTo("case-studies"),    keywords: ["work", "projects", "portfolio"] },
  { id: "nav-contact", label: "Go to Contact",         group: "Navigate", icon: Icon.mail,    action: () => scrollTo("contact"),         keywords: ["hire", "reach out"] },
  { id: "link-github",   label: "Open GitHub",    description: "github.com/mostafammy",           group: "Connect", icon: Icon.github,   action: () => window.open("https://github.com/mostafammy", "_blank") },
  { id: "link-linkedin", label: "Open LinkedIn",  description: "linkedin.com/in/mostafayaser",     group: "Connect", icon: Icon.linkedin, action: () => window.open("https://www.linkedin.com/in/mostafayaser/", "_blank") },
  { id: "link-email",    label: "Send Email",     description: "mostafa.yaser.developer@gmail.com", group: "Connect", icon: Icon.mail,     action: () => { window.location.href = "mailto:mostafa.yaser.developer@gmail.com" } },
  { id: "action-copy-email", label: "Copy Email Address", group: "Actions", icon: Icon.copy, action: () => navigator.clipboard.writeText("mostafa.yaser.developer@gmail.com"), keywords: ["clipboard"] },
  { id: "action-source",     label: "View Source on GitHub", group: "Actions", icon: Icon.code, action: () => window.open("https://github.com/mostafammy/Mo_Yaser-Portfolio-V3", "_blank"), keywords: ["repo", "code", "open source"] },
]

const GROUPS: Array<Command["group"]> = ["Navigate", "Connect", "Actions"]

// ─── Component ───────────────────────────────────────────────────────────────

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [isMac, setIsMac] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const id = setTimeout(() => {
      setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform))
    }, 0)
    return () => clearTimeout(id)
  }, [])

  const filtered = query.trim()
    ? COMMANDS.filter((cmd) => {
        const q = query.toLowerCase()
        return (
          cmd.label.toLowerCase().includes(q) ||
          cmd.group.toLowerCase().includes(q) ||
          cmd.description?.toLowerCase().includes(q) ||
          cmd.keywords?.some((k) => k.includes(q))
        )
      })
    : COMMANDS

  // Flat list used for keyboard index tracking
  const flat = query.trim()
    ? filtered
    : GROUPS.flatMap((g) => COMMANDS.filter((c) => c.group === g))

  const execute = useCallback((cmd: Command) => {
    if (cmd.id === "action-copy-email") {
      navigator.clipboard.writeText("mostafa.yaser.developer@gmail.com")
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setOpen(false)
        setQuery("")
      }, 1100)
      return
    }
    cmd.action()
    setOpen(false)
    setQuery("")
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    setQuery("")
    setCopied(false)
  }, [])

  // Global keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((o) => {
          if (o) { setQuery(""); setCopied(false) }
          return !o
        })
        setSelectedIndex(0)
        return
      }
      if (!open) return
      if (e.key === "Escape") { close(); return }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, flat.length - 1)) }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)) }
      if (e.key === "Enter") { e.preventDefault(); if (flat[selectedIndex]) execute(flat[selectedIndex]) }
    }
    window.addEventListener("keydown", down)
    return () => window.removeEventListener("keydown", down)
  }, [open, flat, selectedIndex, execute, close])

  // Auto-focus on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30)
  }, [open])

  // (selection resets via onChange on the input)

  // ── Renderers ──────────────────────────────────────────────────────────────

  const renderGrouped = () =>
    GROUPS.map((group) => {
      const cmds = COMMANDS.filter((c) => c.group === group)
      const offset = GROUPS.slice(0, GROUPS.indexOf(group)).reduce(
        (acc, g) => acc + COMMANDS.filter((c) => c.group === g).length,
        0
      )
      return (
        <div key={group}>
          <div className="px-3 pt-3 pb-1 text-[10px] tracking-[0.16em] text-white/25 uppercase font-medium select-none">
            {group}
          </div>
          {cmds.map((cmd, i) => (
            <CmdItem
              key={cmd.id}
              cmd={cmd}
              isSelected={selectedIndex === offset + i}
              showCopied={copied && cmd.id === "action-copy-email"}
              onHover={() => setSelectedIndex(offset + i)}
              onExecute={() => execute(cmd)}
            />
          ))}
        </div>
      )
    })

  const renderFiltered = () =>
    filtered.map((cmd, i) => (
      <CmdItem
        key={cmd.id}
        cmd={cmd}
        isSelected={selectedIndex === i}
        showCopied={copied && cmd.id === "action-copy-email"}
        onHover={() => setSelectedIndex(i)}
        onExecute={() => execute(cmd)}
      />
    ))

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Persistent hint button — bottom-right, desktop only */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 0.8 }}
        onClick={() => { setOpen(true); setQuery(""); setSelectedIndex(0) }}
        className="fixed bottom-[26px] right-5 z-40 hidden md:flex items-center gap-1.5
                   px-2.5 py-1.5 rounded-lg
                   bg-white/[0.04] border border-white/[0.07] backdrop-blur-md
                   text-white/25 hover:text-white/55 hover:bg-white/[0.06]
                   transition-colors duration-150"
        aria-label="Open command palette"
      >
        <span className="text-[10px] font-mono">{isMac ? "⌘" : "Ctrl"}</span>
        <span className="text-[10px] font-mono">K</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={close}
              className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[18%] left-1/2 -translate-x-1/2 z-[101]
                         w-[calc(100%-32px)] max-w-[520px]
                         bg-[#111111] border border-white/[0.08] rounded-2xl
                         shadow-[0_32px_80px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.02)]
                         overflow-hidden"
            >
              {/* Search */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
                <span className="text-white/25 flex-shrink-0">{Icon.search}</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0) }}
                  placeholder="Search commands…"
                  className="flex-1 bg-transparent text-[14px] text-white/80 placeholder:text-white/25
                             outline-none caret-blue-400"
                />
                <kbd className="hidden sm:inline text-[10px] text-white/20 border border-white/[0.08] rounded px-1.5 py-0.5 font-mono">
                  ESC
                </kbd>
              </div>

              {/* List */}
              <div className="max-h-[360px] overflow-y-auto py-1.5">
                {filtered.length === 0 ? (
                  <p className="px-4 py-8 text-center text-[13px] text-white/25">
                    No results for &quot;{query}&quot;
                  </p>
                ) : query.trim() ? renderFiltered() : renderGrouped()}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-4 py-2 border-t border-white/[0.05]
                              text-[10px] text-white/20 font-mono select-none">
                <span className="flex items-center gap-1">
                  <kbd className="border border-white/10 rounded px-1">↑</kbd>
                  <kbd className="border border-white/10 rounded px-1">↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="border border-white/10 rounded px-1">↵</kbd>
                  select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="border border-white/10 rounded px-1">ESC</kbd>
                  close
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Command Item ─────────────────────────────────────────────────────────────

function CmdItem({
  cmd,
  isSelected,
  showCopied,
  onHover,
  onExecute,
}: {
  cmd: Command
  isSelected: boolean
  showCopied: boolean
  onHover: () => void
  onExecute: () => void
}) {
  return (
    <button
      onClick={onExecute}
      onMouseEnter={onHover}
      className={[
        "w-[calc(100%-8px)] mx-1 flex items-center gap-3 px-3 py-2.5 rounded-lg",
        "text-left transition-colors duration-75",
        isSelected ? "bg-white/[0.07]" : "hover:bg-white/[0.04]",
      ].join(" ")}
    >
      <span className={isSelected ? "text-blue-400" : "text-white/30"}>
        {showCopied ? Icon.check : cmd.icon}
      </span>
      <span className={["flex-1 text-[13px] font-medium", isSelected ? "text-white/90" : "text-white/55"].join(" ")}>
        {showCopied ? "Copied!" : cmd.label}
      </span>
      {cmd.description && (
        <span className="text-[11px] text-white/25 truncate max-w-[160px] hidden sm:block">
          {cmd.description}
        </span>
      )}
    </button>
  )
}
