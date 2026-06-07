"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import {
  audioActivate,
  audioDeactivate,
  audioSwitchSection,
  type AmbientSection,
} from "@/hooks/use-ambient-audio"

interface AmbientAudioContextValue {
  enabled: boolean
  toggle: () => void
  activeSection: AmbientSection
  setActiveSection: (s: AmbientSection) => void
}

const AmbientAudioContext = createContext<AmbientAudioContextValue>({
  enabled: false,
  toggle: () => {},
  activeSection: "hero",
  setActiveSection: () => {},
})

export function AmbientAudioProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  const [activeSection, setActiveSectionState] = useState<AmbientSection>("hero")

  /**
   * toggle() is called synchronously from a click handler.
   * audioActivate / audioDeactivate are plain module-level functions
   * (not closures, not refs) — guaranteed to execute in gesture context.
   */
  const toggle = useCallback(() => {
    if (!enabled) {
      audioActivate(activeSection) // called in gesture — boots AudioContext
      setEnabled(true)
    } else {
      audioDeactivate()
      setEnabled(false)
    }
  }, [enabled, activeSection])

  const setActiveSection = useCallback((s: AmbientSection) => {
    setActiveSectionState((prev) => {
      if (prev === s) return prev
      audioSwitchSection(s) // tell engine
      return s
    })
  }, [])

  return (
    <AmbientAudioContext.Provider
      value={{ enabled, toggle, activeSection, setActiveSection }}
    >
      {children}
    </AmbientAudioContext.Provider>
  )
}

export function useAmbientAudioContext() {
  return useContext(AmbientAudioContext)
}
