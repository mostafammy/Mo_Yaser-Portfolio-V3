import { NextResponse } from "next/server"

const GQL = "https://api.github.com/graphql"
const REST = "https://api.github.com"
const USERNAME = process.env.GITHUB_USERNAME ?? "mostafammy"

const QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`

export const revalidate = 3600

function computeStreaks(weeks: { contributionDays: { date: string; contributionCount: number }[] }[]) {
  const days = weeks
    .flatMap((w) => w.contributionDays)
    .sort((a, b) => a.date.localeCompare(b.date))

  let currentStreak = 0
  let longestStreak = 0
  let streak = 0

  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  for (let i = 0; i < days.length; i++) {
    const day = days[i]
    if (day.contributionCount > 0) {
      streak++
      if (streak > longestStreak) longestStreak = streak
    } else {
      streak = 0
    }
  }

  // Current streak: walk backwards from today/yesterday
  const activeDays = new Set(days.filter((d) => d.contributionCount > 0).map((d) => d.date))
  const startDate = activeDays.has(today) ? today : activeDays.has(yesterday) ? yesterday : null

  if (startDate) {
    let cursor = new Date(startDate)
    while (true) {
      const key = cursor.toISOString().slice(0, 10)
      if (!activeDays.has(key)) break
      currentStreak++
      cursor = new Date(cursor.getTime() - 86400000)
    }
  }

  return { currentStreak, longestStreak }
}

async function fetchTopLanguages(token: string) {
  try {
    const res = await fetch(
      `${REST}/users/${USERNAME}/repos?per_page=50&sort=pushed&type=owner`,
      {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }
    )
    if (!res.ok) return []

    const repos: { language: string | null; fork: boolean }[] = await res.json()
    const counts: Record<string, number> = {}
    for (const repo of repos) {
      if (repo.fork || !repo.language) continue
      counts[repo.language] = (counts[repo.language] ?? 0) + 1
    }
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([lang, count]) => ({ lang, count }))
  } catch {
    return []
  }
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    return NextResponse.json({ total: 0, weeks: [], unconfigured: true })
  }

  try {
    const [gqlRes, languages] = await Promise.all([
      fetch(GQL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          query: QUERY,
          variables: {
            login: USERNAME,
            from: "2026-01-01T00:00:00Z",
            to: new Date().toISOString(),
          },
        }),
        next: { revalidate: 3600 },
      }),
      fetchTopLanguages(token),
    ])

    if (!gqlRes.ok) throw new Error(`GitHub API ${gqlRes.status}`)

    const json = await gqlRes.json()
    if (json.errors?.length) throw new Error(json.errors[0].message)

    const cal = json?.data?.user?.contributionsCollection?.contributionCalendar
    const weeks = cal?.weeks ?? []
    const { currentStreak, longestStreak } = computeStreaks(weeks)

    return NextResponse.json({
      total: cal?.totalContributions ?? 0,
      weeks,
      currentStreak,
      longestStreak,
      languages,
    })
  } catch (err) {
    return NextResponse.json(
      { total: 0, weeks: [], currentStreak: 0, longestStreak: 0, languages: [], error: String(err) },
      { status: 500 }
    )
  }
}
