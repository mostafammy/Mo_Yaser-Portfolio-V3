/**
 * AmbientSectionTracker — Passive IntersectionObserver that watches
 * all portfolio sections and updates the AmbientAudioContext with
 * whichever section is currently dominant in the viewport.
 *
 * This is a non-rendering component (returns null). Mount it once
 * inside AmbientAudioProvider's subtree.
 *
 * Section → audio scene mapping:
 *   hero              → heroScene     (sub-bass hum + sci-fi shimmer)
 *   story             → storyScene    (lo-fi warm analog)
 *   global-presence   → globalScene   (diffuse pink noise, airport ambience)
 *   everything else   → defaultScene  (quiet ambient breath)
 */

"use client"

import { useEffect } from "react"
import { useAmbientAudioContext } from "@/components/AmbientAudioProvider"
import type { AmbientSection } from "@/hooks/use-ambient-audio"

const SECTION_MAP: Record<string, AmbientSection> = {
  "hero":             "hero",
  "about":            "default",
  "story":            "story",
  "global-presence":  "global-presence",
  "contributions":    "default",   // GitHubContributions uses id="contributions"
  "hackathons":       "default",
  "case-studies":     "default",
  "contact":          "default",
}

export function AmbientSectionTracker() {
  const { setActiveSection } = useAmbientAudioContext()

  useEffect(() => {
    const sectionIds = Object.keys(SECTION_MAP)

    const observers: IntersectionObserver[] = []

    // Track visibility ratios per section ID
    const ratios: Record<string, number> = {}

    function pickDominant() {
      let best = "hero"
      let bestRatio = -1
      for (const [id, ratio] of Object.entries(ratios)) {
        if (ratio > bestRatio) {
          bestRatio = ratio
          best = id
        }
      }
      const scene = SECTION_MAP[best] ?? "default"
      setActiveSection(scene)
    }

    for (const id of sectionIds) {
      ratios[id] = 0

      const el = document.getElementById(id)
      if (!el) continue

      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            ratios[id] = entry.intersectionRatio
          }
          pickDominant()
        },
        {
          threshold: Array.from({ length: 21 }, (_, i) => i / 20), // 0, 0.05, …, 1.0
        }
      )

      obs.observe(el)
      observers.push(obs)
    }

    return () => {
      observers.forEach((o) => o.disconnect())
    }
  }, [setActiveSection])

  return null
}
