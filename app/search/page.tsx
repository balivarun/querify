'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Search, ExternalLink, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Source {
  title: string
  url: string
  snippet: string
}

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const router = useRouter()
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(true)
  const [followUp, setFollowUp] = useState('')

  useEffect(() => {
    if (!query) return
    setLoading(true)
    setAnswer('')
    setSources([])
    const fetchAnswer = async () => {
      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        })
        const data = await res.json()
        setSources(data.sources || [])
        const stream = await fetch('/api/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, sources: data.sources }),
        })
        const reader = stream.body?.getReader()
        const decoder = new TextDecoder()
        setLoading(false)
        if (!reader) return
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          setAnswer((prev) => prev + decoder.decode(value))
        }
      } catch (err) {
        setLoading(false)
        setAnswer('Something went wrong. Please try again.')
      }
    }
    fetchAnswer()
  }, [query])

  const handleFollowUp = () => {
    if (!followUp.trim()) return
    router.push('/search?q=' + encodeURIComponent(followUp.trim()))
    setFollowUp('')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-white mb-6">{query}</h1>
      <div className="mb-6">
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-3">Sources</h2>
        {loading ? (
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 w-48 bg-zinc-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex gap-3 flex-wrap">
            {sources.map((source, i) => {
              let hostname = ''
              try { hostname = new URL(source.url).hostname } catch { hostname = source.url }
              return (
                <a key={i} href={source.url} target="_blank" rel="noopener noreferrer"
                  className="flex flex-col justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-3 w-48 hover:border-zinc-600 transition">
                  <p className="text-xs text-white font-medium line-clamp-2 mb-2">{source.title}</p>
                  <div className="flex items-center gap-1 text-zinc-500 text-xs">
                    <ExternalLink size={10} />
                    <span className="truncate">{hostname}</span>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
      <div className="mb-8">
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-3">Answer</h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 bg-zinc-800 rounded animate-pulse" style={{ width: (90 - i * 8) + '%' }} />
            ))}
          </div>
        ) : (
          <div className="text-zinc-200 leading-relaxed whitespace-pre-wrap text-base">
            {answer}
            {answer && <span className="animate-pulse">▍</span>}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3 focus-within:border-zinc-500 transition">
        <Search size={16} className="text-zinc-400 shrink-0" />
        <input type="text" value={followUp}
          onChange={(e) => setFollowUp(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleFollowUp()}
          placeholder="Ask a follow-up question..."
          className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-sm" />
        <button onClick={handleFollowUp}
          className="bg-white text-black rounded-full p-1.5 hover:bg-zinc-200 transition shrink-0">
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-zinc-400">Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}
