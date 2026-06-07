"use client"

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react"

export type CursorTheme = "default" | "hero" | "about" | "story" | "global-presence" | "github" | "hackathons" | "case-studies" | "contact"

export interface HoverTarget {
  x: number
  y: number
  radius: number
}

interface CursorContextValue {
  activeTheme: CursorTheme
  setActiveTheme: (theme: CursorTheme) => void
  hoverTarget: HoverTarget | null
  setHoverTarget: (target: HoverTarget | null) => void
}

const CursorContext = createContext<CursorContextValue>({
  activeTheme: "default",
  setActiveTheme: () => {},
  hoverTarget: null,
  setHoverTarget: () => {},
})

export function CursorProvider({ children }: { children: ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<CursorTheme>("default")
  const [hoverTarget, setHoverTarget] = useState<HoverTarget | null>(null)

  return (
    <CursorContext.Provider value={{ activeTheme, setActiveTheme, hoverTarget, setHoverTarget }}>
      {children}
    </CursorContext.Provider>
  )
}

export function useCursorTheme() {
  return useContext(CursorContext)
}
