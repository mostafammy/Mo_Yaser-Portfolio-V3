"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { FloatingDock } from "@/components/ui/floating-dock"

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
)

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const FolderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const NAV_ITEMS = [
  { title: "Home", icon: <HomeIcon />, href: "#hero" },
  { title: "About", icon: <UserIcon />, href: "#about" },
  { title: "Journey", icon: <BriefcaseIcon />, href: "#story" },
  { title: "World", icon: <GlobeIcon />, href: "#global-presence" },
  { title: "Work", icon: <FolderIcon />, href: "#case-studies" },
  { title: "Contact", icon: <MailIcon />, href: "#contact" },
]

export function FloatingNav() {
  const [visible, setVisible] = useState(false)
  const [activeSection, setActiveSection] = useState("#hero")
  const [sectionProgress, setSectionProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      setVisible(scrollY > window.innerHeight * 0.55)

      const sections = NAV_ITEMS.map((item) =>
        document.getElementById(item.href.replace("#", ""))
      ).filter(Boolean)

      const vh = window.innerHeight

      for (const section of sections) {
        if (!section) continue
        const rect = section.getBoundingClientRect()
        
        // A section is active if it covers the middle of the screen
        if (rect.top <= vh * 0.5 && rect.bottom >= vh * 0.5) {
          setActiveSection(`#${section.id}`)
          
          // Calculate how much of the section has scrolled past the center
          const totalScrollable = rect.height
          const scrolledPastCenter = (vh * 0.5) - rect.top
          
          let progress = scrolledPastCenter / totalScrollable
          progress = Math.max(0, Math.min(1, progress))
          setSectionProgress(progress)
          break
        }
      }
    }
    
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll() // Initial calculation
    
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.div
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 14,
        pointerEvents: visible ? "auto" : "none",
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-7 left-1/2 -translate-x-1/2 z-50"
    >
      <FloatingDock
        items={NAV_ITEMS}
        activeSection={activeSection}
        sectionProgress={sectionProgress}
        desktopClassName="bg-black/75 backdrop-blur-2xl border border-white/10 shadow-2xl"
        mobileClassName="bg-black/75 backdrop-blur-2xl border border-white/10 shadow-2xl"
      />
    </motion.div>
  )
}
