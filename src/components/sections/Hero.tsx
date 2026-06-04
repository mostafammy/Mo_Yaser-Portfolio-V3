"use client"

import { useRef, useEffect } from "react"
import { motion } from "motion/react"
import dynamic from "next/dynamic"
import { AuroraText } from "@/components/ui/aurora-text"
import { MorphingText } from "@/components/ui/morphing-text"
import { Vortex } from "@/components/ui/vortex"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { CoolMode } from "@/components/ui/cool-mode"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { fadeUp, scaleIn } from "@/lib/motion"

const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
  ssr: false,
})

gsap.registerPlugin(ScrollTrigger)

const ROLES = [
  "Full Stack Engineer",
  "Global Health Technologist",
  "Impact-Driven Builder",
  "IFMSA Project Director",
]

const STATS = [
  { number: "130+", label: "Countries reached" },
  { number: "2 yrs", label: "IFMSA leadership" },
  { number: "7+", label: "Hackathon finals" },
]

const globeConfig = {
  pointSize: 4,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#FFFFFF",
  atmosphereAltitude: 0.1,
  emissive: "#062056",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 30.044, lng: 31.236 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
}

const colors = ["#06b6d4", "#3b82f6", "#6366f1"]

const heroArcs = [
  { order: 1, startLat: 30.044, startLng: 31.236, endLat: 55.676, endLng: 12.568, arcAlt: 0.2, color: colors[0] },
  { order: 1, startLat: 30.044, startLng: 31.236, endLat: 60.169, endLng: 24.938, arcAlt: 0.3, color: colors[1] },
  { order: 2, startLat: 30.044, startLng: 31.236, endLat: 25.204, endLng: 55.271, arcAlt: 0.15, color: colors[2] },
  { order: 2, startLat: 30.044, startLng: 31.236, endLat: 31.953, endLng: 35.911, arcAlt: 0.1, color: colors[0] },
  { order: 3, startLat: 30.044, startLng: 31.236, endLat: 35.009, endLng: -80.94, arcAlt: 0.5, color: colors[1] },
  { order: 3, startLat: 55.676, startLng: 12.568, endLat: 60.169, endLng: 24.938, arcAlt: 0.2, color: colors[2] },
  { order: 4, startLat: 25.204, startLng: 55.271, endLat: 31.953, endLng: 35.911, arcAlt: 0.15, color: colors[0] },
  { order: 4, startLat: 31.953, startLng: 35.911, endLat: 35.009, endLng: -80.94, arcAlt: 0.4, color: colors[1] },
  { order: 5, startLat: 60.169, startLng: 24.938, endLat: 25.204, endLng: 55.271, arcAlt: 0.35, color: colors[2] },
]

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -60,
        opacity: 0,
        ease: "power2.in",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-svh overflow-hidden bg-[#0a0a0a]"
    >
      {/* Vortex particle background */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.18] pointer-events-none">
        <Vortex
          particleCount={280}
          baseHue={220}
          baseSpeed={0}
          rangeSpeed={0.7}
          baseRadius={1}
          rangeRadius={1.2}
          backgroundColor="transparent"
          containerClassName="h-full w-full"
        />
      </div>

      {/* Top radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 45% at 50% 0%, rgba(59,130,246,0.11) 0%, transparent 65%)",
        }}
      />

      {/* Bottom gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent pointer-events-none z-20" />

      {/* Globe Background Element */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        custom={4}
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] opacity-40 pointer-events-none z-0 hidden lg:block"
      >
        <World data={heroArcs} globeConfig={globeConfig} />
      </motion.div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 min-h-svh flex flex-col items-center justify-center
                   px-6 lg:px-16 max-w-5xl mx-auto text-center pt-20 pb-28"
      >
        {/* Label */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="flex items-center gap-3 mb-10"
        >
          <span className="w-6 h-px bg-blue-500/50" />
          <span className="text-[11px] font-medium tracking-[0.25em] text-blue-400/70 uppercase">
            Full Stack SWE · Global Impact
          </span>
          <span className="w-6 h-px bg-blue-500/50" />
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-[clamp(56px,11vw,116px)] font-semibold leading-[0.9]
                     tracking-[-0.04em] text-white mb-8"
        >
          Mostafa{" "}
          <AuroraText
            colors={["#3b82f6", "#8b5cf6", "#06b6d4", "#3b82f6"]}
            speed={0.7}
          >
            Yaser
          </AuroraText>
        </motion.h1>

        {/* Morphing role */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mb-8 w-full h-[32px] sm:h-[48px]"
        >
          <MorphingText
            texts={ROLES}
            className="text-white/55 font-normal text-xl sm:text-3xl"
          />
        </motion.div>

        {/* Description */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="max-w-lg mb-12 min-h-[80px]"
        >
          <TypingAnimation
            className="text-base lg:text-[17px] text-white/35 leading-relaxed font-normal inline"
            text="Building systems that scale — from production web applications to global health program frameworks across 130+ countries."
            duration={25}
          />
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="flex items-center gap-4 flex-wrap justify-center mb-20"
        >
          <CoolMode>
            <a
              href="#case-studies"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full
                         bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium
                         transition-all duration-200
                         shadow-[0_0_28px_rgba(59,130,246,0.28)]
                         hover:shadow-[0_0_40px_rgba(59,130,246,0.48)]"
            >
              See my work
              <svg
                width="13"
                height="13"
                viewBox="0 0 14 14"
                fill="none"
                className="opacity-80"
              >
                <path
                  d="M1 7h12M7 1l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </CoolMode>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full
                       border border-white/10 hover:border-white/20
                       text-white/50 hover:text-white/80 text-sm font-medium
                       transition-all duration-200 backdrop-blur-sm"
          >
            Get in touch
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={6}
          className="flex items-center gap-10 sm:gap-16 justify-center"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-semibold text-white/75 tabular-nums">
                {stat.number}
              </div>
              <div className="text-[11px] text-white/25 mt-1.5 tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-30"
      >
        <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
    </section>
  )
}
