"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"

type Message = { id: string; role: "user" | "assistant"; content: string }

const STARTERS = [
  "What is Mostafa working on right now?",
  "Tell me about his hackathon experience.",
  "What tech stack does he use?",
  "How does he combine tech with global health?",
]

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [unconfigured, setUnconfigured] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text }
    const assistantId = crypto.randomUUID()
    const assistantMsg: Message = { id: assistantId, role: "assistant", content: "" }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput("")
    setIsStreaming(true)

    abortRef.current = new AbortController()

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal,
      })

      if (res.status === 503) {
        setUnconfigured(true)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "API key not configured. Add ANTHROPIC_API_KEY to .env.local." }
              : m
          )
        )
        return
      }

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            )
          )
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "Something went wrong. Try again." }
              : m
          )
        )
      }
    } finally {
      setIsStreaming(false)
    }
  }, [messages, isStreaming])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  function handleStarterClick(text: string) {
    setInput(text)
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Top bar */}
      <div className="border-b border-white/[0.06] shrink-0">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-[12px] font-mono text-white/30 hover:text-white/60
                       transition-colors duration-150 flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                 strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            mostafayaser.earth
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
            <span className="text-[11px] font-mono text-white/25">claude-haiku-4-5</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="pt-8 text-center"
            >
              <p className="text-[28px] font-semibold tracking-[-0.02em] text-white/80 mb-2">
                Ask about Mostafa
              </p>
              <p className="text-[14px] text-white/30 mb-10">
                Powered by Claude Haiku · answers from portfolio context
              </p>

              {unconfigured && (
                <p className="text-[13px] text-amber-400/60 mb-8 font-mono">
                  Add ANTHROPIC_API_KEY to .env.local to enable responses.
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStarterClick(s)}
                    className="text-left px-4 py-3 rounded-xl text-[13px] text-white/45
                               bg-white/[0.03] border border-white/[0.07]
                               hover:bg-white/[0.06] hover:text-white/70
                               transition-colors duration-150 leading-snug"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={[
                    "max-w-[85%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap",
                    m.role === "user"
                      ? "bg-blue-500/[0.12] border border-blue-500/20 text-white/80 rounded-br-sm"
                      : "bg-white/[0.04] border border-white/[0.07] text-white/65 rounded-bl-sm",
                  ].join(" ")}
                >
                  {m.content || (
                    <span className="inline-flex gap-1.5 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-white/30"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3 items-center">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Mostafa…"
              disabled={isStreaming}
              className="flex-1 bg-white/[0.04] border border-white/[0.07] rounded-xl
                         px-4 py-2.5 text-[14px] text-white/80 placeholder:text-white/20
                         outline-none focus:border-blue-500/30 focus:bg-white/[0.06]
                         transition-colors duration-150 disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="w-10 h-10 rounded-xl bg-blue-500/[0.15] border border-blue-500/25
                         flex items-center justify-center text-blue-400/80
                         hover:bg-blue-500/[0.25] hover:text-blue-400
                         disabled:opacity-30 disabled:cursor-not-allowed
                         transition-colors duration-150"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M22 2 11 13M22 2 15 22 11 13 2 9l20-7z" />
              </svg>
            </button>
          </form>
          <p className="text-[10px] text-white/12 text-center mt-2 tracking-wide">
            Answers are AI-generated from portfolio context · may not be fully accurate
          </p>
        </div>
      </div>
    </div>
  )
}
