import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { query } = await req.json()

  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: 'basic',
      max_results: 4,
    }),
  })

  const data = await res.json()

  const sources = data.results?.map((r: any) => ({
    title: r.title,
    url: r.url,
    snippet: r.content,
    favicon: `https://www.google.com/s2/favicons?domain=${new URL(r.url).hostname}`,
  })) || []

  return NextResponse.json({ sources })
}