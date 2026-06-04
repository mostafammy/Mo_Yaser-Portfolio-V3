import { NextResponse } from "next/server"

const GQL = "https://api.github.com/graphql"
const USERNAME = process.env.GITHUB_USERNAME ?? "mostafayaser"

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

export async function GET() {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    return NextResponse.json({ total: 0, weeks: [], unconfigured: true })
  }

  try {
    const res = await fetch(GQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: QUERY,
        variables: {
          login: USERNAME,
          from: "2026-01-01T00:00:00Z",
          to: new Date().toISOString(),
        },
      }),
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`GitHub API ${res.status}`)

    const json = await res.json()

    if (json.errors?.length) {
      throw new Error(json.errors[0].message)
    }

    const cal = json?.data?.user?.contributionsCollection?.contributionCalendar

    return NextResponse.json({
      total: cal?.totalContributions ?? 0,
      weeks: cal?.weeks ?? [],
    })
  } catch (err) {
    return NextResponse.json(
      { total: 0, weeks: [], error: String(err) },
      { status: 500 }
    )
  }
}
