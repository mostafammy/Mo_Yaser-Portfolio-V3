# mostafayaser.earth — Versioning Strategy & Product Roadmap

> Authored from the perspective of a Principal Full Stack SWE.
> Treat this portfolio like a shipped product, not a side project.

---

## Table of Contents

1. [Current State: What We Actually Have](#1-current-state-what-we-actually-have)
2. [Why Version a Portfolio?](#2-why-version-a-portfolio)
3. [Versioning Scheme](#3-versioning-scheme)
4. [Version 0.1.0 — The Launch Artifact](#4-version-010--the-launch-artifact)
5. [Version 1.0.0 — Production-Ready](#5-version-100--production-ready)
6. [Version 1.x — Incremental Excellence](#6-version-1x--incremental-excellence)
7. [Version 2.0.0 — The Generational Leap](#7-version-200--the-generational-leap)
8. [The Exciting Stuff: What to Add Next](#8-the-exciting-stuff-what-to-add-next)
9. [Changelog Convention](#9-changelog-convention)
10. [Release Ceremony](#10-release-ceremony)

---

## 1. Current State: What We Actually Have

### Tech Stack Snapshot

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.7 |
| Runtime | React | 19.2.4 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Scroll | Lenis | 1.3.23 |
| Scroll Orchestration | GSAP + ScrollTrigger | 3.15.0 |
| Component Animation | Framer Motion | 12.40.0 |
| 3D | Three.js + R3F + Drei | 0.184 / 9.6.1 |
| Package Manager | pnpm | workspace |
| Deployment Target | Vercel (inferred) | — |

### Sections In Production

| # | Section | Status | Lines |
|---|---|---|---|
| 1 | Hero | Shipped | 283 |
| 2 | Scroll Marquee | Shipped | 27 |
| 3 | About | Shipped | 202 |
| 4 | Experience | Shipped | 279 |
| 5 | Global Presence | Shipped | 132 |
| 6 | GitHub Contributions | Shipped | 408 |
| 7 | Hackathons | Shipped | 164 |
| 8 | Story | Shipped | 377 |
| 9 | Case Studies | Shipped | 247 |
| 10 | Contact | Shipped | 181 |

**Total production section code:** ~2,300 lines  
**UI component library:** 63 primitives, ~11,738 lines  
**Data layer:** `experience.ts` (12+ roles), `hackathons.ts` (9 events), `globe.ts` (5 arcs)  
**API:** `/api/github-contributions` — GitHub GraphQL proxy, ISR 3600s

### Architecture Decisions (Locked In)

```
Scroll Architecture (Three-Layer, No Conflicts):
  Lenis (momentum + easing)
    └── GSAP ScrollTrigger (position-driven scene choreography)
          └── Framer Motion (component micro-interactions)

Rendering Strategy:
  - Server Components by default (Next.js App Router)
  - dynamic() + ssr:false for Three.js (prevent hydration mismatch)
  - ISR for GitHub contributions (1-hour revalidation)

Design Philosophy:
  - Dark-first, single accent color (electric blue #3b82f6, max 3x/viewport)
  - Apple "perfect fourth" type scale (1.333 ratio with clamp())
  - Data as configuration (experience/hackathons in .ts files, not hardcoded)
```

---

## 2. Why Version a Portfolio?

Most engineers treat their portfolio as a living document with no clear versioning. That's a mistake for three reasons:

**1. Recruiters & collaborators see different snapshots.**  
When you send your link in October vs. March, the site should communicate clearly which "era" of you they're seeing. A version number in the footer signals intentionality.

**2. You can reason about scope.**  
"I'm building v1.0" is a ship-able contract with yourself. "I'm always just improving it" is an endless migration.

**3. It forces you to celebrate shipping.**  
Every `v1.x.0` tag is a concrete milestone. It goes on your GitHub, your commit history, and your own mental record.

---

## 3. Versioning Scheme

We use **Calendar-Aware Semantic Versioning** — a hybrid of SemVer and CalVer that suits a portfolio's reality.

```
MAJOR.MINOR.PATCH

MAJOR  →  Complete redesign or career-era shift
           (e.g., student → industry, new country, new identity)
MINOR  →  New section, significant new feature, or substantial content update
           (e.g., added Projects section, launched blog, added new role)
PATCH  →  Bug fixes, copy edits, perf improvements, dep updates
           (e.g., fixed mobile nav, updated experience data, faster LCP)
```

### Version Tags in Git

```bash
# Tag a release
git tag -a v0.1.0 -m "Initial launch — 10-section scroll narrative"
git push origin v0.1.0

# Create a release on GitHub
gh release create v0.1.0 --title "v0.1.0 — The Origin" --notes-file CHANGELOG.md
```

### Footer Display

The version number should appear in the site footer, subtle but present:

```tsx
// In Contact.tsx or a Footer component
<span className="text-[11px] text-neutral-600 font-mono tracking-widest">
  v0.1.0
</span>
```

---

## 4. Version 0.1.0 — The Launch Artifact

**Tag:** `v0.1.0`  
**Name:** The Origin  
**Status:** Current  
**Shipped:** June 2026

This is the foundation. A complete, opinionated single-scroll portfolio that ships 10 sections, a 63-component UI library, a custom design system, and a real GitHub API integration.

### What Makes 0.1.0 Significant

- Cinematic preloader with scale-up + blur + white flash exit
- Hero with Vortex background, AuroraText name, and MorphingText role cycling
- 3D globe (Three.js) in both Hero and Global Presence section
- Real-time GitHub contribution heatmap via GraphQL API proxy
- GSAP ScrollTrigger choreography across the full scroll narrative
- Lenis smooth scroll with custom momentum easing
- Custom cursor with charge/deform physics (`CursorEffects`)
- Mercator-accurate world map with labeled city pins
- 12+ experience roles with category-based filtering
- 9 hackathon entries with result badges
- Floating dock navigation with macOS-style magnification
- Full dark-mode design system with Apple-grade type scale
- Motion token library (`spring`, `duration`, `variant` presets)

### Known Limitations at 0.1.0

- No blog or writing section
- Case Studies section has placeholder depth (links out, not in-app)
- No analytics or visitor telemetry
- Contact form is visual only (no backend send)
- No OG image / social card metadata
- No sitemap or robots.txt
- Mobile experience underpolished relative to desktop

---

## 5. Version 1.0.0 — Production-Ready

**Target:** Q3 2026  
**Name:** Polished Glass  
**Theme:** Every detail is finished. Nothing feels like a prototype.

### 1.0.0 Scope

#### Infrastructure (Patches, must-have before 1.0)
- [ ] `sitemap.xml` and `robots.txt` generation via Next.js 16 `sitemap.ts`
- [ ] OG image via `opengraph-image.tsx` with dynamic metadata
- [ ] Twitter card metadata (`twitter:card`, `twitter:image`, etc.)
- [ ] Canonical URL and proper `<head>` hygiene
- [ ] `manifest.webmanifest` for PWA installability
- [ ] Environment variable validation at build time (Zod schema on `.env`)
- [ ] Contact form backend (Resend API or Formspree — serverless, no infra)
- [ ] Error boundary on Three.js/Globe components with graceful fallback
- [ ] WCAG 2.1 AA audit — keyboard nav, focus rings, color contrast, `aria-*`
- [ ] Core Web Vitals green on mobile: LCP < 2.5s, CLS < 0.1, INP < 200ms

#### Experience Polish (Minor, aesthetic quality bar)
- [ ] Mobile nav: replace floating dock with slide-in sheet menu
- [ ] Experience section: add live "currently open to" badge (data-driven)
- [ ] Global Presence: add tooltip on arc hover with context (event name, year)
- [ ] GitHub Contributions: show streak count and top languages bar
- [ ] Hackathons: add project description + team size on expand
- [ ] Story section: add pull-quote highlights with animated entrance
- [ ] Contact: add real-time character count and field validation states
- [ ] Preloader: honor `prefers-reduced-motion` — skip to instant fade

---

## 6. Version 1.x — Incremental Excellence

Each minor version adds one meaningful capability:

### v1.1.0 — The Writer

Add a `/writing` route with a blog.

```
/writing              → List of posts (MDX, ISR-cached)
/writing/[slug]       → Individual post (reading time, TOC, og:image)
```

**Implementation:**
- MDX via `next-mdx-remote` or Contentlayer 2
- Frontmatter: `title`, `date`, `tags`, `summary`, `readingTime`
- Syntax highlighting: `rehype-pretty-code` with a custom dark theme
- Reading progress indicator on post pages
- Twitter/X embed via existing `react-tweet`
- RSS feed at `/feed.xml` (auto-generated)

**Design:** Posts render in a `prose` container with your design system's type scale. Same dark aesthetic, but quiet — let the words breathe.

---

### v1.2.0 — The Builder

Add a `/projects` route with deep case studies.

```
/projects             → Filterable grid (by stack, category, year)
/projects/[slug]      → Full case study (problem → process → outcome)
```

**Each case study includes:**
- Hero image or short video loop
- The actual problem statement (not just "I built X")
- Architecture diagram (Excalidraw export or custom SVG)
- Key technical decisions with rationale
- Metrics / outcomes (users, performance, business impact)
- Lessons learned
- GitHub link + live demo if applicable

**This is the section that converts curious visitors into collaborators.**

---

### v1.3.0 — The Experimenter

Add a `/lab` or `/playground` route: a curated collection of interactive experiments.

```
/lab                  → Grid of experiments
/lab/fluid-sim        → WebGL fluid simulation
/lab/type-effects     → Typography experiments
/lab/sound-viz        → Web Audio API visualizer
/lab/physics          → Matter.js or Rapier demos
```

**Why this matters:** It shows you build for curiosity, not just for résumés. The lab differentiates you from every other "senior SWE" portfolio that is just a timeline and some project cards.

---

### v1.4.0 — The Connector

Add a `/now` page — a living document of what you're currently working on, reading, and thinking about. Derek Sivers' concept, widely respected in the senior engineering community.

```
/now                  → What I'm focused on right now
```

Contents:
- Current projects (with progress indicators)
- What I'm learning (books, courses, papers)
- Where I'm traveling / working from
- What I'm building next

Auto-updates from a `now.ts` data file. Commit-to-publish workflow.

---

## 7. Version 2.0.0 — The Generational Leap

**Target:** When your career has a new chapter (new country, new role type, post-grad, etc.)  
**Name:** TBD — to be named when the era is clear

This is a full visual redesign. Not because the current design is bad — it's excellent. But a v2 signals intentional evolution:

- New color system or accent palette
- Rebuilt Hero with a different storytelling mechanic
- Potentially: voice-driven navigation experiment
- Potentially: AI-powered "ask me anything" section (RAG over your resume/writing)
- Archive of v1 accessible at `/archive/v1`

**Rule:** Never deprecate v1 without archiving it. Your past work is evidence.

---

## 8. The Exciting Stuff: What to Add Next

These are features that would make this portfolio genuinely extraordinary — not just "nice portfolio" but "I've never seen this before."

---

### Ambient Sound Layer

Subtle, opt-in spatial audio that responds to scroll position and section.

```tsx
// Concept: each section has a binaural audio signature
// - Hero: deep sub-bass hum, sci-fi resonance
// - GlobalPresence: soft ambient geopolitical noise (distant airports, etc.)
// - Story: quiet lo-fi, warm analog
// Toggle in nav: 🔇 / 🔊
```

**Tech:** Web Audio API + Tone.js. Under 50KB total audio budget. Always off by default with a visible toggle. This is the kind of detail that makes someone stay on your site for 4 minutes instead of 45 seconds.

---

### Command Palette — `⌘K`

A full-featured command palette à la Linear, Vercel, or Raycast.

```
Press ⌘K (or Ctrl+K) →
  > Go to Experience
  > Go to Projects
  > Open GitHub
  > Download Resume
  > Send an email
  > Toggle dark mode
  > Copy email address
  > View source on GitHub
  > ...
```

**Tech:** `cmdk` library (1.5KB) or build it from scratch (you have the component library for it). Makes power users feel at home. Signals that you use tools like this yourself.

---

### Resume as a Living Document

Instead of linking a static PDF, render your resume as a page at `/resume` that:

- Matches your portfolio's design system exactly
- Is printable (`@media print` with clean layout)
- Has a "download as PDF" button (Puppeteer/headless Chrome on the server or a print-triggered download)
- Auto-generates from the same `experience.ts` data file

**Outcome:** Your resume and portfolio are always in sync. No more "forgot to update the PDF."

---

### Real-Time Presence Indicator

A small, tasteful status badge that shows whether you're currently open to work, in a project, or unavailable.

```tsx
// In footer or Contact section
<StatusBadge status="open-to-collaborate" />
// → 🟢 Open to collaborate
// → 🟡 In a sprint, reply may be slow
// → 🔴 Not available right now
```

**Controlled by:** A single line in a `status.ts` config file. You update it, commit, it deploys. No dashboard needed.

---

### Cursor-Responsive Section Themes

Right now the cursor has charge physics. Go further: each section subtly shifts the cursor's visual behavior.

```
Hero          → Cursor leaves aurora trail
Experience    → Cursor shows magnetic pull toward timeline nodes
GlobalPresence → Cursor leaves brief geo-arc trace
GitHub        → Cursor becomes a contribution square that pulses
```

You already have a sophisticated cursor system. This is an extension, not a rewrite.

---

### Tilt-Parallax Card System

Cards in About, Case Studies, and Hackathons should respond to mouse position with a 3D tilt.

```tsx
// On hover, the card tilts 8–12° on both axes
// Inner elements shift at different parallax rates (depth layers)
// Specular highlight moves with mouse angle
// Release → spring back to flat
```

**Tech:** You already have `draggable-card.tsx` in your library. This is a different primitive — magnetic, not draggable. 20–30 lines of math with `framer-motion`'s `useMotionValue`.

---

### Semantic Keyboard Navigation

Portfolio visitors who tab through your site should have a premium experience.

- `Tab` moves through sections (not just interactive elements)
- Each section has a labeled landmark (`role="region"`, `aria-label`)
- `1`–`0` keys jump to sections (Power user shortcut, shown on first visit)
- Skip-to-content link at the very top

**This is what separates senior engineers who think about interfaces from those who only build them.**

---

### Animated SVG Signature

On the Contact section or footer: your actual signature (or a stylized version of your name) draws itself in on scroll.

```tsx
// SVG path with stroke-dasharray / stroke-dashoffset animation
// Triggered by Intersection Observer or GSAP ScrollTrigger
// Duration: ~1.2s, easing: ease-in-out
// Ink color: accent-primary with slight variation
```

**Impact:** Deeply personal. Instantly memorable. Takes 2 hours to build, leaves a lasting impression.

---

### Visitor Memory (Privacy-Safe)

Return visitors get a subtle acknowledgment.

```
"Welcome back."  (shown in Hero subtitle, replaces intro text on 2nd+ visit)
```

**Tech:** `localStorage` with a `firstVisit` timestamp. No cookies, no tracking, fully client-side, zero privacy concerns. One conditional render in Hero.tsx.

---

### AI-Powered Q&A (v2-era feature)

A chat interface at the bottom of the page: "Ask me anything."

```
User: "What's your experience with distributed systems?"
→ Answer drawn from your experience.ts, case studies, and writing, via RAG

User: "Would you be a good fit for a role at [Company]?"
→ Thoughtful, honest, based on your stated values and experience
```

**Tech:** Vercel AI SDK + Claude API (streaming). RAG index over your portfolio content. Rate-limited by IP. Under 200ms TTFB on cold start.

**Why it's compelling:** It's not a gimmick when it's built by you — it's a demonstration of the skill itself.

---

## 9. Changelog Convention

Every version gets a `CHANGELOG.md` entry following Keep a Changelog format:

```markdown
## [1.1.0] — 2026-09-01

### Added
- /writing route with MDX blog and RSS feed
- Reading progress indicator on post pages
- rehype-pretty-code syntax highlighting

### Changed
- GitHub contributions section now shows language breakdown bar
- Global Presence arcs have hover tooltips with event context

### Fixed
- Mobile nav z-index conflict with sticky Experience timeline
- OG image missing for /writing/[slug] pages

### Performance
- Three.js bundle split further: -18KB gzipped on initial load
- LCP improved 340ms on 4G throttling (lazy Globe chunk)
```

---

## 10. Release Ceremony

When you ship a version, do this:

```bash
# 1. Update version in package.json
# 2. Write CHANGELOG.md entry
# 3. Update footer version badge in the site
# 4. Commit with conventional message
git commit -m "chore: release v1.0.0 — Polished Glass"

# 5. Tag it
git tag -a v1.0.0 -m "v1.0.0 — Polished Glass: production-ready, full a11y, contact backend"

# 6. Push tag
git push origin v1.0.0

# 7. Create GitHub release (optional but encouraged)
gh release create v1.0.0 \
  --title "v1.0.0 — Polished Glass" \
  --notes-file CHANGELOG.md

# 8. Post about it.
# Not "check out my portfolio," but: "Shipped v1.0.0 of mostafayaser.earth.
# Here's what I learned building X and Y..."
```

Your portfolio is a public artifact of your craft. Version it like one.

---

## Summary

| Version | Name | Theme | Target |
|---|---|---|---|
| **0.1.0** | The Origin | Foundation complete, launch ready | Shipped (Jun 2026) |
| **1.0.0** | Polished Glass | Zero rough edges, production metrics, a11y | Q3 2026 |
| **1.1.0** | The Writer | Blog, RSS, MDX | Q4 2026 |
| **1.2.0** | The Builder | Deep case studies | Q1 2027 |
| **1.3.0** | The Experimenter | Lab / playground | Q2 2027 |
| **1.4.0** | The Connector | /now page, status indicator | Q2 2027 |
| **2.0.0** | TBD | Career-era redesign | When the time is right |

The most important version is always the next one you actually ship.

---

*mostafayaser.earth — currently at v0.1.0*
