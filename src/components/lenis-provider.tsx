"use client"

import { useRef, useEffect, useState, createContext, useContext, type ReactNode } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface LenisProviderProps {
  children: ReactNode
}

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

export function LenisProvider({ children }: LenisProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const instance = new Lenis({
      anchors: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      autoRaf: false,
    })

    setLenis(instance)

    instance.on("scroll", ScrollTrigger.update)

    gsap.ticker.add((time: number) => {
      instance.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      instance.destroy()
      gsap.ticker.lagSmoothing(1)
    }
  }, [])

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  )
}
