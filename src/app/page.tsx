import { SmoothCursor } from "@/components/ui/smooth-cursor"
import { Preloader } from "@/components/Preloader"
import { FloatingNav } from "@/components/FloatingNav"
import { CommandPalette } from "@/components/CommandPalette"
import { KeyboardNav } from "@/components/KeyboardNav"
import { SectionCursorGlow } from "@/components/SectionCursorGlow"
import { GlobeErrorBoundary } from "@/components/GlobeErrorBoundary"
import { AmbientAudioProvider } from "@/components/AmbientAudioProvider"
import { AmbientSectionTracker } from "@/components/AmbientSectionTracker"
import { Hero } from "@/components/sections/Hero"
import { ScrollMarquee } from "@/components/sections/ScrollMarquee"
import { About } from "@/components/sections/About"
import { GitHubContributions } from "@/components/sections/GitHubContributions"
import { Story } from "@/components/sections/Story"
import { GlobalPresence } from "@/components/sections/GlobalPresence"
import { Hackathons } from "@/components/sections/Hackathons"
import { CaseStudies } from "@/components/sections/CaseStudies"
import { Contact } from "@/components/sections/Contact"
import { CursorProvider } from "@/context/CursorContext"

export default function Home() {
  return (
    <CursorProvider>
      <AmbientAudioProvider>
        {/* Passively watches sections → updates audio engine */}
      <AmbientSectionTracker />

      <Preloader />
      <SmoothCursor />
      <SectionCursorGlow />
      <FloatingNav />
      <CommandPalette />
      <KeyboardNav />
      <main>
        <Hero />
        <ScrollMarquee />
        <About />
        <GitHubContributions />
        <Story />
        <GlobeErrorBoundary>
          <GlobalPresence />
        </GlobeErrorBoundary>
        <Hackathons />
        <CaseStudies />
        <Contact />
      </main>
      </AmbientAudioProvider>
    </CursorProvider>
  )
}
