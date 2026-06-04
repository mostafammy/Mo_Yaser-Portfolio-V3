export type HackathonResult = "Finalist" | "Participant" | "Competitor"

export type HackathonItem = {
  name: string
  org: string
  result: HackathonResult
  period: string
  location: string
  category: string
  badge: string
}

export const hackathons: HackathonItem[] = [
  {
    name: "SalamHack 2026",
    org: "Arab American Society for Education & Development",
    result: "Finalist",
    period: "Mar–May 2026",
    location: "Remote",
    category: "Social Impact",
    badge: "🏆",
  },
  {
    name: "AIEcoHackathon",
    org: "Foras Khadra",
    result: "Finalist",
    period: "Feb 2026",
    location: "Cairo · Hybrid",
    category: "AI + Climate",
    badge: "🌱",
  },
  {
    name: "EcoHack",
    org: "EcoHack",
    result: "Finalist",
    period: "Dec 2025",
    location: "Cairo · On-site",
    category: "Sustainability",
    badge: "♻️",
  },
  {
    name: "Create Apps Championship",
    org: "Dubai Chambers",
    result: "Competitor",
    period: "Oct 2025–Feb 2026",
    location: "Dubai · Remote",
    category: "Product",
    badge: "📱",
  },
  {
    name: "IYNA Alzheimer's Ideathon",
    org: "International Youth Neuroscience Association",
    result: "Participant",
    period: "Jan–Mar 2026",
    location: "Fort Mill, SC · Remote",
    category: "Neuroscience",
    badge: "🧠",
  },
  {
    name: "Junction 2025",
    org: "Junction",
    result: "Participant",
    period: "Nov 2025",
    location: "Espoo, Finland · Remote",
    category: "Technology",
    badge: "🇫🇮",
  },
  {
    name: "Global Education Summit",
    org: "Rosedale International Education",
    result: "Participant",
    period: "Nov 2025",
    location: "Remote",
    category: "EdTech",
    badge: "🎓",
  },
  {
    name: "NASA Space Apps",
    org: "NASA Space Apps Cairo",
    result: "Participant",
    period: "Sep–Oct 2025",
    location: "Zewail City · On-site",
    category: "Space Tech",
    badge: "🚀",
  },
  {
    name: "SalamHack 2025",
    org: "JIS – Jordan Innovation Startups",
    result: "Participant",
    period: "Mar–Apr 2025",
    location: "Jordan · Remote",
    category: "Social Impact",
    badge: "🕊️",
  },
]
