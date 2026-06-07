"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useSpring, useMotionValue, AnimatePresence } from "motion/react"
import { FloatingDock } from "@/components/ui/floating-dock"
import { useLenis } from "@/components/lenis-provider"
import { AmbientSoundToggle } from "@/components/AmbientSoundToggle"

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
  { title: "Home",    icon: <HomeIcon />,      href: "#hero",            label: "Home" },
  { title: "About",   icon: <UserIcon />,      href: "#about",           label: "About" },
  { title: "Journey", icon: <BriefcaseIcon />, href: "#story",           label: "Journey" },
  { title: "World",   icon: <GlobeIcon />,     href: "#global-presence", label: "Global Presence" },
  { title: "Work",    icon: <FolderIcon />,    href: "#case-studies",    label: "Work" },
  { title: "Contact", icon: <MailIcon />,      href: "#contact",         label: "Contact" },
]

export function FloatingNav() {
  const [visible, setVisible] = useState(false)
  const [activeSection, setActiveSection] = useState("#hero")
  const [mobileOpen, setMobileOpen] = useState(false)
  const { scrollY } = useScroll()
  const sectionProgress = useMotionValue(0)
  const smoothProgress = useSpring(sectionProgress, {
    stiffness: 400,
    damping: 40,
    mass: 0.5,
  })

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setVisible(latest > window.innerHeight * 0.55)

      const sections = NAV_ITEMS.map((item) =>
        document.getElementById(item.href.replace("#", ""))
      ).filter(Boolean)

      const vh = window.innerHeight

      for (const section of sections) {
        if (!section) continue
        const rect = section.getBoundingClientRect()

        if (rect.top <= vh * 0.5 && rect.bottom >= vh * 0.5) {
          const nextActive = `#${section.id}`
          setActiveSection((prev) => (prev !== nextActive ? nextActive : prev))

          const totalScrollable = rect.height
          const scrolledPastCenter = vh * 0.5 - rect.top
          let progress = scrolledPastCenter / totalScrollable
          progress = Math.max(0, Math.min(1, progress))
          sectionProgress.set(progress)
          break
        }
      }
    })
  }, [scrollY, sectionProgress])

  // Close mobile sheet on scroll
  useEffect(() => {
    if (!mobileOpen) return
    const unsub = scrollY.on("change", () => setMobileOpen(false))
    return unsub
  }, [mobileOpen, scrollY])

  const lenis = useLenis()

  function handleMobileNav(href: string) {
    setMobileOpen(false)
    setTimeout(() => {
      if (lenis) {
        lenis.scrollTo(href)
      } else {
        document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 200)
  }

  return (
    <>
      {/* ── Desktop FloatingDock + Ambient Toggle ────────────── */}
      <motion.div
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : 14,
          pointerEvents: visible ? "auto" : "none",
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-7 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-2"
      >
        <FloatingDock
          items={NAV_ITEMS}
          activeSection={activeSection}
          sectionProgress={smoothProgress}
          desktopClassName="bg-black/75 backdrop-blur-2xl border border-white/10 shadow-2xl"
          mobileClassName="bg-black/75 backdrop-blur-2xl border border-white/10 shadow-2xl"
        />
        {/* Ambient sound toggle sits right of the dock */}
        <div className="bg-black/75 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl p-1.5 flex items-center">
          <AmbientSoundToggle />
        </div>
      </motion.div>

      {/* ── Mobile hamburger button ──────────────────────────── */}
      <motion.button
        onClick={() => setMobileOpen((prev) => !prev)}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : 14,
          pointerEvents: visible ? "auto" : "none",
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        className="fixed bottom-6 right-5 z-[60] md:hidden
                   w-12 h-12 rounded-2xl bg-black/80 backdrop-blur-xl
                   border border-white/10 shadow-2xl
                   flex items-center justify-center text-white/60
                   hover:text-white/90 transition-colors duration-150"
      >
        <AnimatePresence mode="wait" initial={false}>
          {mobileOpen ? (
            <motion.svg
              key="close"
              initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="menu"
              initial={{ opacity: 0, rotate: 45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -45, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="w-5 h-5"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6"  x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Mobile slide-in sheet ────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="sheet"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-0 left-0 right-0 z-[56] md:hidden
                         bg-[#0e0e0e]/95 backdrop-blur-2xl border-t border-white/[0.07]
                         rounded-t-3xl pb-10 pt-4 px-5 shadow-2xl"
            >
              {/* Handle */}
              <div className="w-9 h-1 rounded-full bg-white/[0.12] mx-auto mb-7" />

              <div className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.href
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleMobileNav(item.href)}
                      className={[
                        "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl",
                        "transition-colors duration-150 text-left",
                        isActive
                          ? "bg-blue-500/[0.08] text-white/85"
                          : "hover:bg-white/[0.04] text-white/45 hover:text-white/70",
                      ].join(" ")}
                    >
                      <span className={[
                        "w-5 h-5 flex-shrink-0",
                        isActive ? "text-blue-400/80" : "text-white/30",
                      ].join(" ")}>
                        {item.icon}
                      </span>
                      <span className="text-[15px] font-medium">
                        {item.label}
                      </span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400/70" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* ── Ambient sound row ─────────────────────────────── */}
              <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between px-4">
                <span className="text-[13px] text-white/35 font-medium">Ambient Sound</span>
                <AmbientSoundToggle />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
