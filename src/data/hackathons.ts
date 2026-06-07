export type HackathonResult = "2nd Place" | "Finalist" | "Competitor" | "Participant"

export type HackathonItem = {
  name: string
  org: string
  result: HackathonResult
  period: string
  location: string
  category: string
  badge: string
  teamSize?: number
  description?: string
  link?: string
}

export const hackathons: HackathonItem[] = [
  {
    name: "SalamHack 2025",
    org: "JIS – Jordan Innovation Startups",
    result: "2nd Place",
    period: "Mar–Apr 2025",
    location: "Jordan · Remote",
    category: "Social Impact",
    badge: "🕊️",
    teamSize: 4,
    description:
      "Built a platform addressing community communication gaps in underserved Arab neighbourhoods. Competed among 200+ teams from across the Arab world. 2nd place podium finish at the live ceremony in Amman.",
  },
  {
    name: "SalamHack 2026",
    org: "Arab American Society for Education & Development",
    result: "Finalist",
    period: "Mar–May 2026",
    location: "Remote",
    category: "Social Impact",
    badge: "🏆",
    teamSize: 3,
    description:
      "Finalist selection out of 300+ applications. Built an AI-assisted civic engagement tool with multilingual support targeting diaspora communities.",
  },
  {
    name: "AIEcoHackathon",
    org: "Foras Khadra",
    result: "Finalist",
    period: "Feb 2026",
    location: "Cairo · Hybrid",
    category: "AI + Climate",
    badge: "🌱",
    teamSize: 3,
    description:
      "Finalist among 80 teams. Developed a computer-vision system for real-time agricultural waste classification to support circular economy workflows.",
  },
  {
    name: "EcoHack",
    org: "EcoHack",
    result: "Finalist",
    period: "Dec 2025",
    location: "Cairo · On-site",
    category: "Sustainability",
    badge: "♻️",
    teamSize: 4,
    description:
      "Finalist position. Prototyped a community-driven carbon-offset tracking app that gamifies sustainable habits for urban residents.",
  },
  {
    name: "Create Apps Championship",
    org: "Dubai Chambers",
    result: "Competitor",
    period: "Oct 2025–Feb 2026",
    location: "Dubai · Remote",
    category: "Product",
    badge: "📱",
    teamSize: 2,
    description:
      "Multi-round product competition hosted by Dubai Chambers. Built a B2B SaaS tool for SME supply-chain visibility across the GCC.",
  },
  {
    name: "IYNA Alzheimer's Ideathon",
    org: "International Youth Neuroscience Association",
    result: "Participant",
    period: "Jan–Mar 2026",
    location: "Fort Mill, SC · Remote",
    category: "Neuroscience",
    badge: "🧠",
    teamSize: 3,
    description:
      "Global ideathon focused on Alzheimer's prevention and care innovations. Proposed a caregiver-coordination app with early-symptom tracking.",
  },
  {
    name: "Junction 2025",
    org: "Junction",
    result: "Participant",
    period: "Nov 2025",
    location: "Espoo, Finland · Remote",
    category: "Technology",
    badge: "🇫🇮",
    teamSize: 4,
    description:
      "Europe's largest hackathon. Built a predictive maintenance dashboard for industrial IoT devices, integrating real-time sensor data streams.",
  },
  {
    name: "Global Education Summit",
    org: "Rosedale International Education",
    result: "Participant",
    period: "Nov 2025",
    location: "Remote",
    category: "EdTech",
    badge: "🎓",
    teamSize: 3,
    description:
      "International education-focused summit/hackathon. Designed an adaptive learning path engine that personalises content sequencing per student.",
  },
  {
    name: "NASA Space Apps",
    org: "NASA Space Apps Cairo",
    result: "Participant",
    period: "Sep–Oct 2025",
    location: "Zewail City · On-site",
    category: "Space Tech",
    badge: "🚀",
    teamSize: 5,
    description:
      "48-hour hackathon at Zewail City of Science & Technology. Built a satellite-imagery analysis tool for detecting urban heat islands.",
  },
]
