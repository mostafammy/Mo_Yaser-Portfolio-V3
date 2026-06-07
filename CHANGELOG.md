# Changelog

All notable changes to mostafayaser.earth are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows Calendar-Aware SemVer — see [VERSIONING.md](./VERSIONING.md).

---

## [Unreleased]

Tracks work in progress that has not yet been tagged as a release.

---

## [0.2.0] — 2026-06-07

**The Sensory Layer** — Post-launch polish sprint. Adds ambient intelligence, spatial feedback, accessibility scaffolding, and visitor awareness. No new sections; every change deepens the experience of what already exists.

### Added

- **Visitor Memory** — `localStorage`-based return-visitor detection (`mye_visited` key). Hero eyebrow swaps to animated `"Welcome back."` on 2nd+ visit. Zero cookies, zero tracking, fully client-side
- **Spatial Ambient Audio** — Opt-in generative soundscape (`useAmbientAudio` hook). Four layered oscillators (drone, shimmer, pulse, texture) via Web Audio API. Persists preference to `localStorage`. Floating audio toggle button in Hero with animated waveform icon
- **Keyboard Navigation** — `KeyboardNav` component registers `1`–`9` section shortcuts and a `?` help overlay. Sections are announced via `aria-live` on focus jump. Fully accessible, no external dependency

### Changed

- Hero label conditionally renders `"Welcome back."` (animated fade-up) in place of `"Full Stack SWE · Global Impact"` for returning visitors

### Performance

- Ambient audio context created lazily on first user gesture — zero impact on initial load

---

## [0.1.0] — 2026-06-06

**The Origin** — Initial launch artifact. A complete single-scroll portfolio narrative built on Next.js 16, React 19, and a three-layer animation stack (Lenis → GSAP → Framer Motion).

### Added

**Sections (10)**
- `Hero` — Vortex particle background, AuroraText name, MorphingText role cycling, TypingAnimation bio, Three.js globe, stats row, CoolMode CTA
- `ScrollMarquee` — Kinetic bidirectional marquee transition between sections
- `About` — Sticky left panel with animated counters, 4 identity cards
- `GitHubContributions` — Live contribution heatmap via GitHub GraphQL API proxy (ISR 3600s)
- `Story` — Extended personal/professional narrative section
- `GlobalPresence` — Mercator-accurate world map with 5 Cairo-origin presence arcs and city chips
- `Hackathons` — 9 competition entries with result badges (Finalist / Competitor / Participant)
- `CaseStudies` — Horizontal-scroll (desktop) / vertical-stack (mobile) case study panels
- `Contact` — Animated vanish input, live API submission, confetti on success, character counter, version badge

**Infrastructure**
- Production SEO metadata — title template, keywords, Open Graph, Twitter `summary_large_image`, robots directives
- `/opengraph-image` — edge-rendered branded 1200×630 social card
- `/sitemap.xml` — Next.js App Router sitemap generation
- `/robots.txt` — crawl rules with sitemap reference
- `/manifest.webmanifest` — PWA manifest, dark theme color `#0a0a0a`
- `/api/contact` — Resend email delivery with HTML template, input validation, graceful no-op when key absent
- `/api/github-contributions` — GitHub GraphQL proxy

**UI Component Library (63 primitives)**
- 3D globe, world map, vortex, aurora-text, morphing-text, typing-animation, smooth-cursor, floating-dock, cool-mode, animated-gradient-text, confetti, and 52 additional primitives

**Experience & Data**
- `CursorEffects` — custom cursor with charge physics, particle burst, shockwave, debris system, screen shake
- `Preloader` — cinematic macOS terminal loader with FlickeringGrid + Vortex, charge-level effects, scale-up blur exit
- `FloatingNav` — scroll-aware floating dock with active section detection and progress indicator
- Motion token library (`spring`, `duration`, `variant` presets in `src/lib/motion.ts`)
- Data layer: `experience.ts` (12+ roles), `hackathons.ts` (9 events), `globe.ts` (5 presence arcs)

### Technical

- Framework: Next.js 16.2.7 (App Router) · React 19.2.4 · TypeScript 5
- Animation: Framer Motion 12.40.0 · GSAP 3.15.0 · Lenis 1.3.23
- 3D: Three.js 0.184 · React Three Fiber 9.6.1 · Three-Globe 2.45.2
- Styling: Tailwind CSS 4 · Geist font family
- Email: Resend 6.12.4
- Package manager: pnpm

---

<!-- ─────────────────────────────────────────────
     FUTURE ENTRIES  (move up when shipped)
     ───────────────────────────────────────────── -->

## [1.1.0] — _planned_

> **Example entry — not yet released.** Move above this comment block when tagged.

### Added
- `/writing` route with MDX blog and RSS feed
- Reading progress indicator on post pages
- rehype-pretty-code syntax highlighting

### Changed
- GitHub contributions section now shows language breakdown bar
- Global Presence arcs have hover tooltips with event context

### Fixed
- Mobile nav z-index conflict with sticky Experience timeline
- OG image missing for `/writing/[slug]` pages

### Performance
- Three.js bundle split further: −18 KB gzipped on initial load
- LCP improved 340 ms on 4G throttling (lazy Globe chunk)

---

[Unreleased]: https://github.com/mostafammy/Mo_Yaser-Portfolio-V3/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/mostafammy/Mo_Yaser-Portfolio-V3/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/mostafammy/Mo_Yaser-Portfolio-V3/releases/tag/v0.1.0
