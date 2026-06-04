import { SmoothCursor } from "@/components/ui/smooth-cursor"
import { FloatingNav } from "@/components/FloatingNav"
import { Hero } from "@/components/sections/Hero"
import { ScrollMarquee } from "@/components/sections/ScrollMarquee"
import { About } from "@/components/sections/About"
import { GitHubContributions } from "@/components/sections/GitHubContributions"
import { Story } from "@/components/sections/Story"
import { GlobalPresence } from "@/components/sections/GlobalPresence"
import { Hackathons } from "@/components/sections/Hackathons"
import { CaseStudies } from "@/components/sections/CaseStudies"
import { Contact } from "@/components/sections/Contact"

export default function Home() {
  return (
    <>
      <SmoothCursor />
      <FloatingNav />
      <main>
        <Hero />
        <ScrollMarquee />
        <About />
        <GitHubContributions />
        <Story />
        <GlobalPresence />
        <Hackathons />
        <CaseStudies />
        <Contact />
      </main>
    </>
  )
}
