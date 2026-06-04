export type Category =
  | "engineering"
  | "global-health"
  | "leadership"
  | "entrepreneurship"

export type ExperienceItem = {
  id: string
  title: string
  org: string
  type: string
  period: string
  location: string
  category: Category
  highlight: boolean
  description: string
  skills: string[]
}

export const experience: ExperienceItem[] = [
  {
    id: "scholarx",
    title: "Full Stack SWE",
    org: "ScholarX",
    type: "Part-time",
    period: "Dec 2025 – Present",
    location: "Cairo, Egypt · Hybrid",
    category: "engineering",
    highlight: true,
    description:
      "Building production web applications for the ScholarX mentorship platform. Focused on frontend architecture, performance, and developer experience using Next.js App Router.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "ifmsa-director",
    title: "NVMSA Project Support Division Director",
    org: "IFMSA",
    type: "Part-time",
    period: "Nov 2025 – Present",
    location: "Egypt · Hybrid",
    category: "leadership",
    highlight: true,
    description:
      "Directing project operations and support across the National Volunteer Medical Students Association. Managing cross-functional teams and strategic initiatives.",
    skills: [
      "Project Management",
      "Software Project Management",
      "Team Leadership",
      "Strategic Planning",
    ],
  },
  {
    id: "ifmsa-mwg",
    title: "Health Systems Program Renewal MWG",
    org: "IFMSA",
    type: "Volunteer",
    period: "Jan 2026 – Apr 2026",
    location: "Copenhagen · Remote",
    category: "global-health",
    highlight: true,
    description:
      "Selected for the international Major Working Group responsible for the strategic renewal of the Health Systems Program. Collaborated with global leadership to restructure frameworks across 130+ National Member Organizations, aligning program descriptions with WHO priorities and the evolving needs of NMOs worldwide.",
    skills: [
      "Program Strategy",
      "Global Health",
      "Systems Design",
      "Policy Analysis",
    ],
  },
  {
    id: "ifmsa-health-swg",
    title: "Coordinator, Health Systems SWG",
    org: "IFMSA",
    type: "Volunteer",
    period: "Feb 2026 – May 2026",
    location: "Copenhagen · Remote",
    category: "global-health",
    highlight: false,
    description:
      "Coordinating the Health Systems Sub-Working Group as part of IFMSA's Program Renewal initiative.",
    skills: ["Global Health", "Coordination", "Policy"],
  },
  {
    id: "ifmsa-sponsors",
    title: "Sponsors Database & Sponsorship Kits SWG",
    org: "IFMSA-Egypt",
    type: "Volunteer",
    period: "Nov 2025 – Mar 2026",
    location: "Cairo, Egypt · Remote",
    category: "leadership",
    highlight: false,
    description:
      "Building and managing IFMSA-Egypt's sponsor database and creating sponsorship kit materials for national events.",
    skills: ["Sponsorship", "Database Management", "Communications"],
  },
  {
    id: "enactus",
    title: "Co-Founder & Branding Director",
    org: "Enactus New Valley",
    type: "Part-time",
    period: "Dec 2025 – Present",
    location: "Egypt · Hybrid",
    category: "entrepreneurship",
    highlight: true,
    description:
      "Co-Founded the Enactus New Valley chapter and built the complete visual identity system — brand guidelines, tone of voice, and presentation frameworks used in national competitions.",
    skills: [
      "Brand Strategy",
      "Visual Identity",
      "Entrepreneurship",
      "Leadership",
    ],
  },
  {
    id: "mckinsey-forward",
    title: "Forward Graduate",
    org: "McKinsey & Company",
    type: "Program",
    period: "May 2025 – Jul 2025",
    location: "Remote",
    category: "leadership",
    highlight: true,
    description:
      "Completed McKinsey's Forward program — a competitive leadership and professional skills initiative for emerging leaders, covering structured problem-solving, communication, and strategic thinking.",
    skills: [
      "Leadership",
      "Problem Solving",
      "Consulting Frameworks",
      "Communication",
    ],
  },
  {
    id: "ifmsa-scome",
    title: "NVMSA SCOME Coordinator",
    org: "IFMSA",
    type: "Part-time",
    period: "Jul 2024 – Oct 2025",
    location: "Egypt · Hybrid",
    category: "leadership",
    highlight: false,
    description:
      "Coordinating Standing Committee On Medical Education (SCOME) activities for the National Volunteer Medical Students Association.",
    skills: ["Medical Education", "Coordination", "Program Management"],
  },
  {
    id: "aspire",
    title: "Aspire Leader 2025",
    org: "Aspire Institute",
    type: "Program",
    period: "Oct 2025 – Dec 2025",
    location: "Remote",
    category: "leadership",
    highlight: true,
    description:
      "Selected for the Aspire Leader cohort — a competitive organizational leadership program. Developed frameworks in team leadership, organizational strategy, and cross-cultural communication.",
    skills: [
      "Leadership",
      "Team Leadership",
      "Organizational Development",
      "Communication",
    ],
  },
  {
    id: "empower-hub",
    title: "Scholarships Academy",
    org: "Empower Hub",
    type: "Internship",
    period: "Sep 2025 – Nov 2025",
    location: "Remote",
    category: "leadership",
    highlight: false,
    description:
      "Completed Empower Hub's Scholarships Academy program on professional development and scholarship application strategy.",
    skills: ["Professional Development", "Research", "Writing"],
  },
  {
    id: "cisco-digitopia",
    title: "Digitopia 2025",
    org: "Cisco",
    type: "Program",
    period: "Aug 2025 – Oct 2025",
    location: "Remote",
    category: "engineering",
    highlight: false,
    description:
      "Completed Cisco's Digitopia 2025 program covering digital transformation, enterprise networking, and cloud technologies.",
    skills: ["Digital Transformation", "Networking", "Cloud"],
  },
  {
    id: "devfest-25",
    title: "DevFest'25",
    org: "Google Developer Group Helwan",
    type: "Event",
    period: "Nov 2025",
    location: "Cairo, Egypt · On-site",
    category: "engineering",
    highlight: false,
    description:
      "Attended the largest GDG conference in the Helwan region. Key sessions: AI Meets Flutter, Web Accessibility best practices, and Modern Scrum management.",
    skills: ["Flutter", "AI", "Web Accessibility", "Agile"],
  },
]
