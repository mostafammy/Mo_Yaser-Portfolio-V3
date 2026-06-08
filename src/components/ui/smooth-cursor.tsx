"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useSpring, AnimatePresence } from "motion/react"
import { useCursorTheme } from "@/context/CursorContext"
import {
  IconSparkles,
  IconFingerprint,
  IconCompass,
  IconPlanet,
  IconBolt,
  IconMicroscope,
  IconSend,
} from "@tabler/icons-react"

interface Position {
  x: number
  y: number
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  vx: number
  vy: number
  type: "aurora" | "arc"
}

export interface SmoothCursorProps {
  springConfig?: {
    damping: number
    stiffness: number
    mass: number
    restDelta: number
  }
}

const DESKTOP_POINTER_QUERY = "(any-hover: hover) and (any-pointer: fine)"

function isTrackablePointer(pointerType: string) {
  return pointerType !== "touch"
}

export function SmoothCursor({
  springConfig = {
    damping: 45,
    stiffness: 400,
    mass: 1,
    restDelta: 0.001,
  },
}: SmoothCursorProps) {
  const lastMousePos = useRef<Position>({ x: 0, y: 0 })
  const velocity = useRef<Position>({ x: 0, y: 0 })
  const lastUpdateTime = useRef<number>(0)
  const previousAngle = useRef(0)
  const accumulatedRotation = useRef(0)
  const [isEnabled, setIsEnabled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  
  const { activeTheme, hoverTarget } = useCursorTheme()
  const [particles, setParticles] = useState<Particle[]>([])

  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)
  const rotation = useSpring(0, {
    ...springConfig,
    damping: 60,
    stiffness: 300,
  })
  const scale = useSpring(1, {
    ...springConfig,
    stiffness: 500,
    damping: 35,
  })

  useEffect(() => { lastUpdateTime.current = Date.now() }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_POINTER_QUERY)

    const updateEnabled = () => {
      const nextIsEnabled = mediaQuery.matches
      setIsEnabled(nextIsEnabled)

      if (!nextIsEnabled) {
        setIsVisible(false)
      }
    }

    updateEnabled()
    mediaQuery.addEventListener("change", updateEnabled)

    return () => {
      mediaQuery.removeEventListener("change", updateEnabled)
    }
  }, [])

  useEffect(() => {
    if (!isEnabled) {
      return
    }

    let timeout: ReturnType<typeof setTimeout> | null = null

    const updateVelocity = (currentPos: Position) => {
      const currentTime = Date.now()
      const deltaTime = currentTime - lastUpdateTime.current

      if (deltaTime > 0) {
        velocity.current = {
          x: (currentPos.x - lastMousePos.current.x) / deltaTime,
          y: (currentPos.y - lastMousePos.current.y) / deltaTime,
        }
      }

      lastUpdateTime.current = currentTime
      lastMousePos.current = currentPos
    }

    const smoothPointerMove = (e: PointerEvent) => {
      if (!isTrackablePointer(e.pointerType)) {
        return
      }

      setIsVisible(true)

      let targetX = e.clientX
      let targetY = e.clientY

      // Magnetic Pull Logic
      if (hoverTarget) {
        const dx = e.clientX - hoverTarget.x
        const dy = e.clientY - hoverTarget.y
        const dist = Math.hypot(dx, dy)
        if (dist < hoverTarget.radius) {
          // Snap tightly with slight parallax
          targetX = hoverTarget.x + (dx * 0.1)
          targetY = hoverTarget.y + (dy * 0.1)
        }
      }

      const currentPos = { x: targetX, y: targetY }
      updateVelocity(currentPos)

      const speed = Math.sqrt(
        Math.pow(velocity.current.x, 2) + Math.pow(velocity.current.y, 2)
      )

      cursorX.set(currentPos.x)
      cursorY.set(currentPos.y)

      if (speed > 0.1) {
        const currentAngle =
          Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
          90

        let angleDiff = currentAngle - previousAngle.current
        if (angleDiff > 180) angleDiff -= 360
        if (angleDiff < -180) angleDiff += 360
        accumulatedRotation.current += angleDiff
        rotation.set(accumulatedRotation.current)
        previousAngle.current = currentAngle

        scale.set(0.95)

        // Particle generation for section themes
        if (activeTheme === "hero" || activeTheme === "global-presence") {
          const spawnChance = activeTheme === "hero" ? (speed > 1.5 ? 0.6 : 0.2) : 0.4
          if (Math.random() < spawnChance) {
            const isAurora = activeTheme === "hero"
            const colors = isAurora
              ? ["#a855f7", "#06b6d4", "#ffffff"]
              : ["#10b981", "#34d399", "#a7f3d0"]
            
            setParticles(prev => [...prev.slice(-30), {
              id: Date.now() + Math.random(),
              x: targetX,
              y: targetY,
              color: colors[Math.floor(Math.random() * colors.length)],
              size: isAurora ? Math.random() * 15 + 5 : Math.random() * 4 + 2,
              vx: (Math.random() - 0.5) * (isAurora ? 20 : 5) - velocity.current.x * 5,
              vy: (Math.random() - 0.5) * (isAurora ? 20 : 5) - velocity.current.y * 5,
              type: isAurora ? "aurora" : "arc"
            }])
          }
        }

        if (timeout !== null) {
          clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
          scale.set(1)
        }, 150)
      }
    }

    let rafId = 0
    const throttledPointerMove = (e: PointerEvent) => {
      if (!isTrackablePointer(e.pointerType)) {
        return
      }

      if (rafId) return

      rafId = requestAnimationFrame(() => {
        smoothPointerMove(e)
        rafId = 0
      })
    }

    document.body.style.cursor = "none"
    window.addEventListener("pointermove", throttledPointerMove, {
      passive: true,
    })

    return () => {
      window.removeEventListener("pointermove", throttledPointerMove)
      document.body.style.cursor = "auto"
      if (rafId) cancelAnimationFrame(rafId)
      if (timeout !== null) {
        clearTimeout(timeout)
      }
    }
  }, [cursorX, cursorY, rotation, scale, isEnabled, hoverTarget, activeTheme])

  if (!isEnabled) {
    return null
  }

  const isGithub = activeTheme === "github"
  const isMagnetic = hoverTarget !== null

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[101]">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              opacity: p.type === "aurora" ? 0.4 : 0.6,
              scale: 1,
              x: p.x - p.size / 2,
              y: p.y - p.size / 2
            }}
            animate={{
              opacity: 0,
              scale: p.type === "aurora" ? 3 : 0.5,
              x: p.x - p.size / 2 + p.vx,
              y: p.y - p.size / 2 + p.vy
            }}
            transition={{ duration: p.type === "aurora" ? 1.5 : 0.8, ease: "easeOut" }}
            onAnimationComplete={() => {
              setParticles((prev) => prev.filter((item) => item.id !== p.id))
            }}
            className="absolute pointer-events-none rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              filter: p.type === "aurora" ? "blur(12px)" : "blur(2px)",
              mixBlendMode: "screen",
            }}
          />
        ))}
      </div>

      <motion.div
        style={{
          position: "fixed",
          left: cursorX,
          top: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          rotate: isGithub || isMagnetic ? 0 : rotation,
          scale: scale,
          zIndex: 100,
          pointerEvents: "none",
          willChange: "transform",
          opacity: isVisible ? 1 : 0,
        }}
        initial={false}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{
          duration: 0.15,
        }}
      >
        <AnimatePresence mode="wait">
          {isMagnetic ? (
            <motion.div
              key="magnetic-ring"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-16 h-16 rounded-full border-[1.5px] border-indigo-400/60 bg-indigo-500/10 shadow-[0_0_15px_rgba(129,140,248,0.3)] backdrop-blur-[2px]"
            />
          ) : isGithub ? (
            <motion.div
              key="github-cursor"
              initial={{ scale: 0.5, opacity: 0, borderRadius: "8px" }}
              animate={{ 
                scale: 1,
                opacity: 1,
                borderRadius: "3px"
              }}
              exit={{ scale: 0.5, opacity: 0, borderRadius: "8px" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-4 h-4 bg-[#39d353] border border-[#238636] shadow-[0_0_12px_rgba(57,211,83,0.5)]"
            />
          ) : (
            <motion.div
              key={`cursor-${activeTheme}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              
              {activeTheme !== "default" && (
                <motion.div 
                  initial={{ opacity: 0, x: -5, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 12, filter: "blur(0px)" }}
                  transition={{ delay: 0.05, duration: 0.3 }}
                  className="absolute left-1.5 flex items-center justify-center"
                >
                  {activeTheme === "hero" && <IconSparkles size={20} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" stroke={1.5} />}
                  {activeTheme === "about" && <IconFingerprint size={20} className="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]" stroke={1.5} />}
                  {activeTheme === "story" && <IconCompass size={20} className="text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]" stroke={1.5} />}
                  {activeTheme === "global-presence" && <IconPlanet size={20} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" stroke={1.5} />}
                  {activeTheme === "hackathons" && <IconBolt size={20} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" stroke={1.5} />}
                  {activeTheme === "case-studies" && <IconMicroscope size={20} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" stroke={1.5} />}
                  {activeTheme === "contact" && <IconSend size={20} className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" stroke={1.5} />}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
