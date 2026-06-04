"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input"
import { FloatingDock } from "@/components/ui/floating-dock"
import { fadeUp } from "@/lib/motion"

const PLACEHOLDERS = [
  "What are you building?",
  "How can I help?",
  "What's the problem worth solving?",
  "Let's talk — what's on your mind?",
]

const SOCIAL_LINKS = [
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/mostafayaser/",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-full h-full text-neutral-400"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    title: "GitHub",
    href: "https://github.com/mostafayaser",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-full h-full text-neutral-400"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    title: "Email",
    href: "mailto:mostafa.yaser.developer@gmail.com",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full text-neutral-400"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
]

export function Contact() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section
      id="contact"
      className="relative bg-[#0a0a0a] py-28 lg:py-44 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 45% at 50% 100%, rgba(59,130,246,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-3xl mx-auto px-6 lg:px-16 text-center relative z-10">
        {/* Label */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <span className="w-5 h-px bg-blue-500/60" />
          <span className="text-[11px] tracking-[0.22em] text-blue-400/70 uppercase font-medium">
            / contact
          </span>
          <span className="w-5 h-px bg-blue-500/60" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={1}
          viewport={{ once: true }}
          className="text-[clamp(36px,7vw,68px)] font-semibold tracking-[-0.03em]
                     text-white mb-4 leading-[1.0]"
        >
          Let's build something
          <br />
          <span className="text-white/35">that matters.</span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={2}
          viewport={{ once: true }}
          className="text-[15px] text-white/35 mb-12 max-w-md mx-auto leading-relaxed"
        >
          Whether it's a product, a program, or a collaboration — if it's
          meaningful, I'm interested.
        </motion.p>

        {/* Input */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={3}
          viewport={{ once: true }}
          className="mb-14"
        >
          {submitted ? (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-4 text-white/45 text-sm"
            >
              Message received — I'll be in touch.
            </motion.p>
          ) : (
            <PlaceholdersAndVanishInput
              placeholders={PLACEHOLDERS}
              onChange={() => {}}
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
            />
          )}
        </motion.div>

        {/* Social links */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={4}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <FloatingDock
            items={SOCIAL_LINKS}
            desktopClassName="bg-white/[0.04] border border-white/[0.08] backdrop-blur-md"
            mobileClassName="bg-white/[0.04] border border-white/[0.08]"
          />
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={5}
          viewport={{ once: true }}
          className="mt-16 text-[11px] text-white/15 tracking-wide"
        >
          Mostafa Yaser · Cairo, Egypt · {new Date().getFullYear()}
        </motion.p>
      </div>
    </section>
  )
}
