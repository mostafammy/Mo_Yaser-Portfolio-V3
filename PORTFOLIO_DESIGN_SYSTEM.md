# mostafayaser.earth — Principal-Level Portfolio Design System
### From Boilerplate to Benchmark: A Complete Build Guide

> Written from the perspective of a Principal Full Stack SWE who has shipped design systems
> at scale. Every decision here is intentional, reversible, and traceable to user impact.

---

## 0. The Strategic Frame — What Story Are We Telling?

Before a single line of animation code is written, the narrative must be locked.

**The raw material:** Mostafa Yaser is a Full Stack SWE who operates at the intersection
of three uncommon vectors simultaneously — *engineering excellence*, *global health systems*,
and *impact-driven entrepreneurship*. Most portfolios pick one. Yours earns all three.

**The single sentence a recruiter/collaborator should leave with:**
> *"A builder who ships production code AND shapes global health policy — he operates
> at the level where systems thinking and software architecture are the same skill."*

**The emotional arc of the page (treat it like a film):**
```
ACT 1 — Presence      →  Hero: Who are you? Global. Technical. Purposeful.
ACT 2 — Credibility   →  Experience & Impact: What have you done? Show receipts.
ACT 3 — Craft         →  Case Studies: How do you think and build?
ACT 4 — Humanity      →  About + Globe: Where have you been? What drives you?
ACT 5 — Invitation    →  Contact: What do we build together?
```

This document follows that arc. Every component choice and animation decision
reinforces the story — never decoration for decoration's sake.

---

## 1. Architecture — Page & Route Structure

```
src/app/
├── page.tsx                    ← Landing (single scroll narrative)
├── work/
│   └── [slug]/page.tsx         ← Individual case study deep-dives
└── globals.css

src/components/
├── sections/                   ← NEW — one file per section
│   ├── Hero.tsx
│   ├── ScrollMarquee.tsx
│   ├── About.tsx
│   ├── Experience.tsx
│   ├── GlobalPresence.tsx
│   ├── Hackathons.tsx
│   ├── CaseStudies.tsx
│   └── Contact.tsx
├── ui/                         ← Existing (keep as-is)
└── [existing demos]            ← Reference only, not used in production
```

**page.tsx composition — the scroll narrative in order:**

```tsx
export default function Home() {
  return (
    <>
      <SmoothCursor />          {/* Global — already exists */}
      <FloatingNav />           {/* Sticky, morphs on scroll */}
      <Hero />
      <ScrollMarquee />
      <About />
      <Experience />
      <GlobalPresence />
      <Hackathons />
      <CaseStudies />
      <Contact />
    </>
  )
}
```

---

## 2. Foundation — Typography, Color & Motion Tokens

### 2.1 Typography Scale (update globals.css)

```css
/* Add to globals.css under @theme inline */
--font-display: var(--font-geist-sans);   /* All headings */
--font-body:    var(--font-geist-sans);   /* Body copy */
--font-code:    var(--font-geist-mono);   /* Code/terminal */

/* Type scale — Apple's 1.333 (perfect fourth) ratio */
--text-hero:    clamp(56px, 8vw, 104px);   /* Name */
--text-display: clamp(40px, 6vw, 72px);    /* Section headers */
--text-title:   clamp(28px, 4vw, 48px);    /* Card titles */
--text-body:    clamp(16px, 1.5vw, 18px);  /* Paragraphs */
--text-label:   12px;                      /* Tags, labels */

/* Letter spacing */
--tracking-tight:  -0.03em;   /* Large display text */
--tracking-normal: -0.01em;   /* Body */
--tracking-wide:   0.08em;    /* Labels/tags (uppercase) */
```

### 2.2 Color System (Dark-First)

The existing CSS variables are correct structure. Enhance them:

```css
:root {
  /* Accent — one single accent color, used sparingly */
  --accent-primary: #3b82f6;        /* Electric blue — confidence */
  --accent-glow:    rgba(59,130,246,0.15);

  /* Surface layers */
  --surface-0: #0a0a0a;             /* Page background */
  --surface-1: #111111;             /* Card background */
  --surface-2: #1a1a1a;             /* Elevated card */
  --surface-border: rgba(255,255,255,0.06);

  /* Text */
  --text-primary:   #f0f0f0;
  --text-secondary: #a3a3a3;
  --text-tertiary:  #525252;
}
```

**The rule:** Accent color appears maximum 3 times per viewport. Everything else is
neutral. This is how Apple uses color — as emphasis, not decoration.

### 2.3 Motion Tokens (create src/lib/motion.ts)

```ts
// src/lib/motion.ts
export const spring = {
  snappy:  { type: 'spring', stiffness: 400, damping: 30 },
  smooth:  { type: 'spring', stiffness: 200, damping: 25 },
  gentle:  { type: 'spring', stiffness: 100, damping: 20 },
  bounce:  { type: 'spring', stiffness: 300, damping: 15 },
}

export const ease = {
  out:     [0.16, 1, 0.3, 1],    /* Expo out — fast start, graceful end */
  in:      [0.7, 0, 0.84, 0],    /* Expo in */
  inOut:   [0.87, 0, 0.13, 1],   /* Expo in-out */
  apple:   [0.25, 0.46, 0.45, 0.94],  /* Apple's signature easing */
}

export const duration = {
  instant: 0.15,
  fast:    0.3,
  normal:  0.5,
  slow:    0.8,
  scene:   1.2,
}

/* Reusable Framer Motion variants */
export const fadeUp = {
  hidden:  { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: (i = 0) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.1, duration: duration.normal, ease: ease.out }
  }),
}

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.08, duration: duration.normal }
  }),
}

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { delay: i * 0.1, ...spring.smooth }
  }),
}
```

---

## 3. Lenis + GSAP Integration (Already Wired — Verify & Extend)

Your `lenis-provider.tsx` already exists. Confirm it includes the ScrollTrigger sync:

```tsx
// src/components/lenis-provider.tsx — verify this pattern is present
'use client'
import Lenis from 'lenis'
import { useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Critical: Lenis drives GSAP ScrollTrigger — not the browser
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
    }
  }, [])

  return <>{children}</>
}
```

**The architecture principle:** Lenis owns the scroll. GSAP ScrollTrigger reads from Lenis.
Framer Motion handles component-level micro-interactions. Never mix scroll sources.

```
Scroll Source Hierarchy:
  Lenis (momentum)
    └── GSAP ScrollTrigger (scroll-driven scene choreography)
          └── Framer Motion (component entrance + hover + micro-interactions)
```

---

## 4. Section-by-Section Build Guide

---

### SECTION 1 — Hero

**Goal:** In 3 seconds, communicate: global presence, engineering identity, visual confidence.

**Viewport:** 100vh, centered, dark background.

**Component Map:**
| Element | Component | Animation |
|---|---|---|
| Background | `VortexDemo` (subtle, slow) | Static — always running |
| Custom cursor | `SmoothCursor` (global) | Follows pointer |
| Your name | `AuroraText` + Framer `fadeUp` | Entrance delay 0.3s |
| Role tagline | `MorphingText` | Cycles 4 phrases (see below) |
| Sub-description | `TypingAnimation` | Types after name animates in |
| CTA button | `Button` + `CoolMode` | Particle burst on hover |
| Scroll indicator | Custom SVG arrow | Lenis-driven opacity fade-out |
| Globe | `globe.tsx` (Three.js) | Floats right side, slow auto-rotate |

**MorphingText phrases (4 cycles):**
```
"Full Stack Engineer"
"Global Health Technologist"
"Impact-Driven Builder"
"IFMSA Project Director"
```

**Hero animation timeline (Framer Motion stagger):**
```
t=0.0s  →  Vortex background fades in (opacity 0 → 0.4, blur 20px → 0)
t=0.3s  →  Name (AuroraText) slides up + fades in
t=0.6s  →  MorphingText role tagline appears
t=0.9s  →  TypingAnimation subtitle begins typing
t=1.1s  →  CTA button scales in (scaleIn variant)
t=1.4s  →  Globe scales in from right (scale 0.7 → 1, spring.gentle)
t=2.0s  →  Scroll indicator pulses into view
```

**Globe positioning:** Absolute right side, ~45% viewport width, clipped at edges.
On mobile: moves to bottom, reduced to 50vw.

**GSAP on scroll out of hero:**
```ts
// Hero exit — everything floats up and fades as user scrolls
gsap.to('#hero-content', {
  y: -80,
  opacity: 0,
  ease: 'power2.in',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  }
})
```

---

### SECTION 2 — Scroll Marquee (Transition Bridge)

**Purpose:** Resets visual tension between Hero and About. Communicates scale.

**Component:** `ScrollBasedVelocity` (already exists)

**Content — two rows, opposite directions:**
```
Row 1 (left):  "Full Stack SWE · IFMSA · Global Health · React · Next.js · TypeScript · "
Row 2 (right): "Hackathon Finalist · Cairo · Copenhagen · Helsinki · Dubai · Open Source · "
```

**Config:**
```tsx
<ScrollBasedVelocity
  texts={[
    "Full Stack SWE · IFMSA · Global Health · React · Next.js · TypeScript · ",
    "Hackathon Finalist · Cairo · Copenhagen · Helsinki · Dubai · Open Source · "
  ]}
  velocity={3}
  className="text-xl font-semibold text-white/20 uppercase tracking-widest"
/>
```

This section is purely visual — 80px tall, no content, just kinetic energy.

---

### SECTION 3 — About (Personal Narrative)

**Goal:** Make the recruiter feel something. Not a bio — a story.

**Layout:** Two-column on desktop. Left: sticky text block. Right: scrolling detail cards.

**GSAP ScrollTrigger pattern (sticky left panel):**
```ts
ScrollTrigger.create({
  trigger: '#about-section',
  pin: '#about-left',
  start: 'top top',
  end: 'bottom bottom',
  pinSpacing: false,
})
```

**Left panel content:**
```
[Small label: "/ about"]

"I build systems that
 scale across borders."

[3 sentences — personal narrative]
"From restructuring global health programs for 130+ countries
 to shipping production web applications, I operate where
 technical precision meets human impact."

[2 stat counters — animated on scroll-into-view]
  "130+"    →  "Countries reached via IFMSA work"
  "7+"      →  "Hackathon finals (2025–2026)"
```

**Animated counters (GSAP):**
```ts
// When counter enters viewport, count up
gsap.from(counterRef.current, {
  textContent: 0,
  duration: 2,
  snap: { textContent: 1 },
  ease: 'power2.out',
  scrollTrigger: { trigger: counterRef.current, start: 'top 80%' }
})
```

**Right panel — 4 scrolling cards (Framer Motion stagger):**

Card 1 — Engineering Identity
```
[Icon: code brackets]
"Engineer by discipline"
"Full Stack with a focus on frontend architecture, performance,
 and developer experience. React, Next.js, TypeScript."
```

Card 2 — Global Health
```
[Icon: globe]
"Global health systems, technically"
"Selected for IFMSA's international Major Working Group
 restructuring health programs across 130+ countries."
```

Card 3 — Entrepreneurship
```
[Icon: lightbulb]
"Builder, not just coder"
"Co-Founded and lead branding at Enactus New Valley.
 Competed in 7 international hackathons across 4 continents."
```

Card 4 — Leadership
```
[Icon: people]
"Aspire Leader 2025"
"Organizational leadership training, Aspire Institute.
 Managing IFMSA's Project Support Division across Egypt."
```

**Card entrance (Framer Motion):**
```tsx
<motion.div
  variants={fadeUp}
  initial="hidden"
  whileInView="visible"
  custom={index}
  viewport={{ once: true, margin: '-80px' }}
>
```

---

### SECTION 4 — Experience Timeline

**Goal:** Communicate depth and credibility without overwhelming. Show the trajectory.

**Layout:** Vertical timeline, centered spine on desktop, left-aligned on mobile.

**Timeline spine animation (GSAP):**
```ts
// Draw the vertical line as user scrolls
gsap.fromTo('#timeline-line',
  { scaleY: 0, transformOrigin: 'top center' },
  {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#experience-section',
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: true,
    }
  }
)
```

**Timeline data structure (src/data/experience.ts):**

```ts
export const experience = [
  {
    id: 'scholarx',
    title: 'Full Stack SWE',
    org: 'ScholarX',
    type: 'Part-time',
    period: 'Dec 2025 – Present',
    location: 'Cairo, Egypt · Hybrid',
    category: 'engineering',
    highlight: true,
    description: 'Building production web applications...',
    skills: ['React', 'Next.js', 'TypeScript'],
  },
  {
    id: 'ifmsa-director',
    title: 'NVMSA Project Support Division Director',
    org: 'IFMSA',
    type: 'Part-time',
    period: 'Nov 2025 – Present',
    location: 'Egypt · Hybrid',
    category: 'leadership',
    highlight: true,
    description: 'Directing project operations across the National Volunteer Medical Students Association.',
    skills: ['Project Management', 'Software Project Management'],
  },
  {
    id: 'ifmsa-mwg',
    title: 'Health Systems Program Renewal MWG',
    org: 'IFMSA',
    type: 'Volunteer',
    period: 'Jan 2026 – Apr 2026',
    location: 'Copenhagen · Remote',
    category: 'global-health',
    highlight: true,
    description: 'Selected for the international Major Working Group responsible for strategic renewal of the Health Systems Program. Collaborating with global leadership to restructure frameworks across 130+ National Member Organizations.',
    skills: ['Global Health', 'Program Strategy', 'Policy'],
  },
  {
    id: 'enactus',
    title: 'Co-Founder & Branding Director',
    org: 'Enactus New Valley',
    type: 'Part-time',
    period: 'Dec 2025 – Present',
    location: 'Egypt · Hybrid',
    category: 'entrepreneurship',
    highlight: false,
    description: '',
    skills: ['Branding', 'Leadership', 'Entrepreneurship'],
  },
  // ... remaining entries
]
```

**Timeline card component design:**

Each card has 3 states:
- **Default:** Minimal — org name, title, period, location dot
- **Hovered:** Expands to show description + skill chips (Framer Motion layout animation)
- **Highlighted:** Blue left border accent for `highlight: true` entries

```tsx
<motion.div
  layout                              // Framer auto-animates height change
  whileHover={{ x: 6 }}
  transition={spring.snappy}
  className="relative pl-6 border-l-2 border-transparent
             data-[highlight=true]:border-blue-500"
>
```

**Skill chips on expanded cards:**
```tsx
{skills.map((skill, i) => (
  <motion.span
    key={skill}
    variants={fadeIn}
    custom={i}
    initial="hidden"
    animate="visible"
    className="px-2 py-0.5 text-xs rounded-full bg-white/5
               border border-white/10 text-white/60"
  >
    {skill}
  </motion.span>
))}
```

**Category filter (top of section):**
```
[All] [Engineering] [Global Health] [Leadership] [Entrepreneurship]
```
Filter uses Framer Motion `AnimatePresence` + `layout` for smooth card reflow.

---

### SECTION 5 — Global Presence

**Goal:** Show that Mostafa operates globally without saying it explicitly. Let geography speak.

**Component:** `WorldMap` (already exists — uses dotted-map + arcs)

**Layout:** Full-width, 70vh height, dark background. Dots glow on the relevant cities.

**Arc connections to draw (src/data/globe.ts):**
```ts
export const presenceArcs = [
  // Base: Cairo
  { startLat: 30.0444, startLng: 31.2357, endLat: 55.6761, endLng: 12.5683,
    label: 'Copenhagen — IFMSA MWG' },
  { startLat: 30.0444, startLng: 31.2357, endLat: 60.1699, endLng: 24.9384,
    label: 'Helsinki — Junction 2025' },
  { startLat: 30.0444, startLng: 31.2357, endLat: 25.2048, endLng: 55.2708,
    label: 'Dubai — Create Apps Championship' },
  { startLat: 30.0444, startLng: 31.2357, endLat: 31.9539, endLng: 35.9106,
    label: 'Amman — SalamHack 2025' },
  { startLat: 30.0444, startLng: 31.2357, endLat: 35.0902, endLng: -80.7936,
    label: 'Fort Mill, SC — IYNA Ideathon' },
]
```

**GSAP ScrollTrigger entrance — arcs draw on scroll:**
```ts
// Arcs reveal sequentially as section enters viewport
ScrollTrigger.create({
  trigger: '#global-presence',
  start: 'top 60%',
  onEnter: () => {
    presenceArcs.forEach((_, i) => {
      gsap.delayedCall(i * 0.3, () => drawArc(i))
    })
  }
})
```

**Section header with live count:**
```
[Label: "/ presence"]
"Active across
 5 continents"

[Animated counter: cities visited/collaborated with]
```

**Below the map — city chips:**
```tsx
const cities = [
  { name: 'Cairo', flag: '🇪🇬', roles: 2 },
  { name: 'Copenhagen', flag: '🇩🇰', roles: 2 },
  { name: 'Helsinki', flag: '🇫🇮', roles: 1 },
  { name: 'Dubai', flag: '🇦🇪', roles: 1 },
  { name: 'Fort Mill', flag: '🇺🇸', roles: 1 },
]
```

---

### SECTION 6 — Hackathons & Awards

**Goal:** Communicate competitive excellence. Show wins, not just participation.

**Layout:** Masonry/grid of `CometCard` components.

**Data (src/data/hackathons.ts):**
```ts
export const hackathons = [
  {
    name: 'SalamHack 2026',
    org: 'Arab American Society for Education and Development',
    result: 'Finalist',
    period: 'Mar–May 2026',
    location: 'Remote',
    category: 'Social Impact',
    badge: '🏆',
  },
  {
    name: 'IYNA Alzheimer\'s Ideathon',
    org: 'International Youth Neuroscience Association',
    result: 'Participant',
    period: 'Jan–Mar 2026',
    location: 'Fort Mill, SC · Remote',
    category: 'Neuroscience',
    badge: '🧠',
  },
  {
    name: 'AIEcoHackathon',
    org: 'Foras Khadra',
    result: 'Finalist',
    period: 'Feb 2026',
    location: 'Cairo · Hybrid',
    category: 'AI + Sustainability',
    badge: '🌱',
  },
  {
    name: 'Create Apps Championship',
    org: 'Dubai Chambers',
    result: 'Competitor',
    period: 'Oct 2025–Feb 2026',
    location: 'Dubai · Remote',
    category: 'Product',
    badge: '📱',
  },
  {
    name: 'EcoHack',
    org: 'EcoHack',
    result: 'Finalist',
    period: 'Dec 2025',
    location: 'Cairo · On-site',
    category: 'Sustainability',
    badge: '♻️',
  },
  {
    name: 'Junction 2025',
    org: 'Junction',
    result: 'Participant',
    period: 'Nov 2025',
    location: 'Espoo, Finland · Remote',
    category: 'Technology',
    badge: '🇫🇮',
  },
  {
    name: 'NASA Space Apps',
    org: 'NASA Space Apps Cairo',
    result: 'Participant',
    period: 'Sep–Oct 2025',
    location: 'Zewail City · On-site',
    category: 'Space Tech',
    badge: '🚀',
  },
  {
    name: 'SalamHack 2025',
    org: 'JIS – Jordan Innovation Startups',
    result: 'Participant',
    period: 'Mar–Apr 2025',
    location: 'Jordan · Remote',
    category: 'Social Impact',
    badge: '🕊️',
  },
]
```

**Grid layout with stagger entrance:**
```tsx
<motion.div
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  variants={{
    visible: { transition: { staggerChildren: 0.08 } }
  }}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-100px' }}
>
  {hackathons.map((h, i) => (
    <motion.div key={h.name} variants={scaleIn} custom={i}>
      <CometCard>
        {/* card content */}
      </CometCard>
    </motion.div>
  ))}
</motion.div>
```

**"Finalist" badge treatment:**
```tsx
{h.result === 'Finalist' && (
  <SparklesText
    text="Finalist"
    className="text-xs font-semibold text-amber-400"
    sparklesCount={4}
  />
)}
```

**Confetti on Finalist card hover:**
```tsx
import { useRef } from 'react'
import confetti from 'canvas-confetti'

const finalistRef = useRef(null)

const handleHover = () => {
  const rect = finalistRef.current.getBoundingClientRect()
  confetti({
    particleCount: 30,
    spread: 50,
    origin: {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: rect.top / window.innerHeight,
    },
    colors: ['#3b82f6', '#8b5cf6', '#f59e0b'],
  })
}
```

---

### SECTION 7 — Case Studies

**Goal:** Show how you *think*, not just what you built. This is the deepest section.
Recruiters at senior levels skip the skills list and read here first.

**Layout:** GSAP-pinned horizontal scroll container (3 case study slides).

**GSAP Horizontal Scroll:**
```ts
const panels = gsap.utils.toArray('.case-study-panel')

gsap.to(panels, {
  xPercent: -100 * (panels.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '#case-studies',
    pin: true,
    scrub: 1,
    snap: 1 / (panels.length - 1),
    end: () => `+=${document.querySelector('#case-studies').offsetWidth}`
  }
})
```

**3 Case Studies to build:**

---

**Case Study 1: ScholarX Platform (Engineering)**
```
[Full-bleed dark card, left-aligned]

Category:   "Engineering · Full Stack"
Title:      "Building for scholars at scale"
Subtitle:   "ScholarX mentorship platform — production frontend architecture"

Problem:    "Scholars needed a reliable, fast platform to connect with mentors
             across time zones. The existing solution was brittle."

Solution:   "Re-architected the frontend using Next.js App Router, implemented
             optimistic UI patterns, and reduced Time-to-Interactive by X%."

Stack chips: [Next.js] [TypeScript] [React] [Tailwind] [...]

Visual:     MacbookScroll component showing the app UI
```

---

**Case Study 2: IFMSA Health Systems MWG (Systems Thinking)**
```
[Full-bleed card, slightly warmer tone]

Category:   "Global Health · Policy · Systems Design"
Title:      "Redesigning a program framework for 130+ countries"
Subtitle:   "IFMSA Health Systems Program Renewal — Strategic Architecture"

Problem:    "IFMSA's Health Systems program descriptions were misaligned with
             global health priorities. NMOs couldn't effectively enroll or
             adapt the programs to local contexts."

Process:    [3-step visual flow]
            1. Audit existing framework → identify gaps vs. WHO priorities
            2. Collaborate with global leads → restructure program descriptions
            3. Validate with NMOs → ensure accessibility across contexts

Impact:     "Framework adopted by [N] National Member Organizations globally.
             Presented at IFMSA General Assembly."

Insight:    "The skills are identical: understand the system, find the constraints,
             redesign the architecture. Whether the system is a codebase or a
             global health program."
```

---

**Case Study 3: Enactus New Valley — Brand System (Design + Impact)**
```
[Full-bleed card]

Category:   "Entrepreneurship · Branding · Leadership"
Title:      "Building a brand that moves people to act"
Subtitle:   "Enactus New Valley — brand identity from zero"

Challenge:  "A social enterprise chapter with no visual identity, no brand
             consistency, and no narrative framework."

Delivered:  [Visual grid of brand assets if available, or abstract color blocks]
            • Complete visual identity system
            • Tone of voice and messaging framework
            • Presentation templates used in pitches

Outcome:    "Active chapter competing in Enactus national competitions."
```

**Navigation between case studies:**
- Progress indicator: `ProgressIndicator` component
- Keyboard navigation: left/right arrows
- Swipe on mobile

---

### SECTION 8 — Contact

**Goal:** Make reaching out feel personal and frictionless. No generic "get in touch."

**Layout:** Full-width, centered, generous whitespace.

**Headline approach:**
```
[Label: "/ contact"]

"Let's build something
 that matters."

[Subtext]
"Whether it's a product, a program, or a collaboration —
 if it's meaningful, I'm interested."
```

**Input component:** `PlaceholdersAndVanishInput` (already exists)

**Placeholder cycling text:**
```
"What are you building?"
"How can I help?"
"What's the problem worth solving?"
"Let's talk — what's on your mind?"
```

**Social links via FloatingDock:**
```tsx
const links = [
  { title: 'LinkedIn', icon: <LinkedInIcon />, href: '...' },
  { title: 'GitHub',   icon: <GitHubIcon />,   href: '...' },
  { title: 'Email',    icon: <MailIcon />,      href: 'mailto:...' },
]

<FloatingDock items={links} />
```

**Background treatment:**
```
BackgroundRippleEffect — subtle, triggered on input focus
```

---

## 5. Navigation — FloatingDock as Persistent Nav

**Replace default navigation with FloatingDock:**
```tsx
// Sticky to bottom center, visible after 100px scroll
const navItems = [
  { title: 'Home',       icon: <HomeIcon />,    href: '#hero' },
  { title: 'About',      icon: <UserIcon />,    href: '#about' },
  { title: 'Experience', icon: <BriefcaseIcon/>,href: '#experience' },
  { title: 'Work',       icon: <FolderIcon />,  href: '#case-studies' },
  { title: 'Contact',    icon: <MailIcon />,    href: '#contact' },
]
```

**GSAP appearance on scroll:**
```ts
gsap.from('#floating-nav', {
  y: 80, opacity: 0,
  scrollTrigger: {
    trigger: '#hero',
    start: 'bottom 80%',
    toggleActions: 'play none none reverse',
  }
})
```

---

## 6. Page Transition System

**For the `/work/[slug]` case study pages, add full-page transitions:**

```tsx
// In layout.tsx or a page wrapper
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

**Curtain wipe effect (optional, Apple-level polish):**
```tsx
// Overlay div that slides down on exit, slides up on enter
// Gives the impression of a page "turning"
const curtain = {
  initial: { scaleY: 0, transformOrigin: 'top' },
  animate: { scaleY: 0, transformOrigin: 'bottom' },
  exit:    { scaleY: 1, transformOrigin: 'top',
             transition: { duration: 0.4, ease: [0.87, 0, 0.13, 1] } }
}
```

---

## 7. Performance Budget & Constraints

Running Three.js globe, GSAP ScrollTrigger, Lenis, and Framer Motion simultaneously
requires discipline. Follow this budget:

| Concern | Rule |
|---|---|
| Three.js scenes | Max 1 active at a time. Pause when off-screen. |
| GSAP ScrollTriggers | Kill on component unmount. Use `context()` for cleanup. |
| Framer animations | Use `viewport={{ once: true }}` for entrance animations. Never re-trigger. |
| Image assets | WebP only. Use Next.js `<Image>` with explicit `width`/`height`. |
| Font loading | Already configured via `next/font`. No external font CDNs. |
| Bundle size | `gsap/ScrollTrigger` is tree-shakeable — import specifically, not from `gsap`. |

**GSAP cleanup pattern (always use this):**
```ts
useEffect(() => {
  const ctx = gsap.context(() => {
    // all gsap code here
  }, containerRef)

  return () => ctx.revert()   // clean unmount
}, [])
```

**Three.js globe pause pattern:**
```ts
// In globe.tsx — pause render loop when not visible
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) renderer.setAnimationLoop(animate)
  else renderer.setAnimationLoop(null)
})
observer.observe(containerRef.current)
```

---

## 8. Mobile Responsiveness Rules

Every section must degrade gracefully. The non-negotiables:

| Desktop Element | Mobile Equivalent |
|---|---|
| Globe (45vw right side) | Centered, 80vw, below text |
| Horizontal case study scroll | Vertical card stack |
| GSAP pinned sticky panels | Normal scroll, no pinning |
| FloatingDock | Moves to bottom, icon-only |
| Two-column About | Single column, stat counters stacked |
| WorldMap (70vh) | WorldMap (40vh), reduced arcs |

**Breakpoint rule:** Use Tailwind's `md:` for layout shifts, GSAP's `matchMedia` for
conditional scroll triggers:

```ts
ScrollTrigger.matchMedia({
  '(min-width: 768px)': function() {
    // horizontal case study scroll — desktop only
  },
  '(max-width: 767px)': function() {
    // simple fade-up — mobile
  }
})
```

---

## 9. Dark Mode Polish

The `ThemeProvider` is already wired. Add these details:

**Noise texture overlay for depth** — use `NoiseTexture` component:
```tsx
// In layout.tsx, above all content
<NoiseTexture opacity={0.03} />  // Very subtle grain — adds depth to flat backgrounds
```

**Gradient mesh backgrounds per section:**
```css
/* About section */
#about { background: radial-gradient(ellipse at 30% 50%, #1a1a2e 0%, #0a0a0a 70%); }

/* Hackathons section */
#hackathons { background: radial-gradient(ellipse at 70% 30%, #1a0a2e 0%, #0a0a0a 70%); }

/* Contact section */
#contact { background: radial-gradient(ellipse at 50% 80%, #0a1a2e 0%, #0a0a0a 70%); }
```

---

## 10. Implementation Order (Sequenced for Zero Rework)

Follow this order exactly — later sections depend on tokens established earlier:

```
Week 1 — Foundation
  [ ] 1. Update globals.css with type scale + color tokens
  [ ] 2. Create src/lib/motion.ts with all animation variants
  [ ] 3. Verify LenisProvider has GSAP ScrollTrigger sync
  [ ] 4. Create src/data/ files: experience.ts, hackathons.ts
  [ ] 5. Create src/components/sections/ directory structure

Week 2 — Hero + Navigation
  [ ] 6. Build sections/Hero.tsx
  [ ] 7. Build sections/ScrollMarquee.tsx
  [ ] 8. Wire FloatingDock as persistent nav
  [ ] 9. Confirm SmoothCursor works globally

Week 3 — Narrative Sections
  [ ] 10. Build sections/About.tsx (sticky panel + GSAP counter)
  [ ] 11. Build sections/Experience.tsx (timeline + filter)
  [ ] 12. Build sections/GlobalPresence.tsx (WorldMap + arcs)

Week 4 — Showcase Sections
  [ ] 13. Build sections/Hackathons.tsx (CometCard grid)
  [ ] 14. Build sections/CaseStudies.tsx (GSAP horizontal scroll)
  [ ] 15. Build sections/Contact.tsx

Week 5 — Polish + Perf
  [ ] 16. Add page transitions (AnimatePresence)
  [ ] 17. Three.js globe performance (IntersectionObserver pause)
  [ ] 18. Mobile responsive pass
  [ ] 19. GSAP context cleanup audit
  [ ] 20. Lighthouse audit — target 90+ performance score
```

---

## 11. The 10 Details That Separate Good from Exceptional

These are the micro-decisions that Apple product teams obsess over:

1. **Cursor behavior** — `SmoothCursor` grows slightly when hovering links.
   Shrinks on click. Add `mix-blend-mode: difference` for dark-on-light inversion.

2. **Section transitions** — Every section-to-section boundary has a 1px gradient
   separator (transparent → surface-border → transparent). Never a hard edge.

3. **Text selection** — Custom `::selection` color matching your accent:
   ```css
   ::selection { background: rgba(59,130,246,0.3); color: #f0f0f0; }
   ```

4. **Scroll snap feel** — Lenis duration 1.2 with exponential easing feels
   like macOS rubber-band scrolling. Do not change this value.

5. **Loading state** — Before Lenis initializes, the page should not jump.
   Lock `body { overflow: hidden }` until LenisProvider mounts.

6. **Focus states** — All interactive elements have visible focus rings
   (blue, 2px, 2px offset). Non-negotiable for accessibility.

7. **Reduced motion** — All GSAP + Framer animations check
   `prefers-reduced-motion` and reduce to opacity-only:
   ```ts
   const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
   // if true: skip y/scale transforms, keep opacity fades
   ```

8. **Skill chips** — Never show more than 5 chips. Use "+ N more" with
   AnimatePresence expand on click.

9. **Empty state** — If filters yield 0 results (experience section filter),
   show a friendly message with `TypingAnimation`, not a blank space.

10. **Meta and OG tags** — Set `og:image` to a custom screenshot of the hero.
    LinkedIn and Slack unfurls will show your portfolio correctly when shared.

---

## 12. The Benchmark

A portfolio is done when a senior hiring manager or collaborator can:

1. **In 5 seconds:** Know who you are and what you do.
2. **In 30 seconds:** Understand why you're different from other candidates.
3. **In 3 minutes:** Walk away with a specific project to ask you about.
4. **At any point:** Reach you without friction.

This design system delivers all four.
The animations serve the story. The story serves the person reading it.
That's the only metric that matters.

---

*Document authored for mostafayaser.earth — June 2026*
*Stack: Next.js 16 · React 19 · TypeScript · Tailwind 4 · Framer Motion 12 · GSAP 3.15 · Lenis 1.3 · Three.js 0.184*
