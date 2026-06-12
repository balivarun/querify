'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense, useRef } from 'react'
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
  const geometryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (geometryRef.current) {
        const shapes = geometryRef.current.querySelectorAll('[data-shape]')
        shapes.forEach((shape, index) => {
          const speed = 0.03 + index * 0.01
          const moveX = (e.clientX - window.innerWidth / 2) * speed
          const moveY = (e.clientY - window.innerHeight / 2) * speed

          ;(shape as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

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
    router.push(`/search?q=${encodeURIComponent(followUp.trim())}`)
    setFollowUp('')
  }

  return (
    <div className="relative w-full min-h-screen">
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 animate-gradient" />
      </div>

      <div className="fixed inset-0 -z-10 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      <div ref={geometryRef} className="fixed inset-0 -z-10 overflow-hidden">
        <div
          data-shape="cube"
          className="absolute w-64 sm:w-96 h-64 sm:h-96 top-1/4 left-1/4 transition-transform duration-700 will-change-transform"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.03) 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(59, 130, 246, 0.15)',
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.1)',
          }}
        />
        <div
          data-shape="circle"
          className="absolute w-56 sm:w-80 h-56 sm:h-80 bottom-1/4 right-1/4 transition-transform duration-700 will-change-transform"
          style={{
            borderRadius: '50%',
            border: '1px solid rgba(124, 58, 202, 0.2)',
            boxShadow: '0 0 60px rgba(124, 58, 202, 0.15)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12">

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 sm:mb-8 line-clamp-3">{query}</h1>

        <div className="mb-8 sm:mb-10">
          <h2 className="text-xs sm:text-sm font-medium text-blue-300/70 uppercase tracking-wide mb-3 sm:mb-4">Sources</h2>

          {loading ? (
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 w-40 sm:w-56 bg-blue-500/10 border border-blue-400/20 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="flex gap-2 sm:gap-3 flex-wrap">

              {sources.map((source, i) => {
                let hostname = ''
                try {
                  hostname = new URL(source.url).hostname
                } catch {
                  hostname = source.url
                }
                return (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col justify-between bg-blue-500/10 backdrop-blur-sm border border-blue-400/30 rounded-xl p-3 sm:p-4 w-40 sm:w-56 hover:border-blue-400/60 hover:bg-blue-500/15 transition-all duration-300 group"
                  >
                    <p className="text-xs text-blue-100 font-medium line-clamp-2 mb-2 sm:mb-3 group-hover:text-white transition-colors">
                      {source.title}
                    </p>
                    <div className="flex items-center gap-1 text-blue-300/50 text-xs group-hover:text-blue-300 transition-colors">
                      <ExternalLink size={10} className="sm:size-3" />
                      <span className="truncate text-xs">{hostname}</span>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </div>

        <div className="mb-8 sm:mb-10">
          <h2 className="text-xs sm:text-sm font-medium text-blue-300/70 uppercase tracking-wide mb-3 sm:mb-4">Answer</h2>

          {loading ? (
            <div className="space-y-2 sm:space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-3 sm:h-4 bg-blue-500/10 border border-blue-400/20 rounded animate-pulse"
                  style={{ width: `${90 - i * 8}%` }}
                />
              ))}
            </div>
          ) : (
            <div className="text-blue-200/80 leading-relaxed whitespace-pre-wrap text-sm sm:text-base bg-blue-500/5 backdrop-blur-sm border border-blue-400/20 rounded-xl p-4 sm:p-6">
              {answer}
              {answer && <span className="animate-pulse">▍</span>}
            </div>
          )}
        </div>

        <div className="group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative flex items-center gap-2 sm:gap-3 bg-blue-500/10 backdrop-blur-xl border border-blue-400/30 rounded-full px-4 sm:px-6 py-3 sm:py-4 focus-within:border-blue-400/60 focus-within:bg-blue-500/15 transition-all duration-300 shadow-lg hover:shadow-blue-500/20">
            <Search size={14} className="text-blue-400/60 shrink-0 sm:size-4" />
            <input
              type="text"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFollowUp()}
              placeholder="Follow-up question..."
              className="flex-1 bg-transparent text-white placeholder-blue-300/40 outline-none text-xs sm:text-sm"
            />
            <button
              onClick={handleFollowUp}
              className="group/btn bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-1 sm:p-1.5 hover:from-blue-400 hover:to-blue-500 transition-all duration-300 shrink-0"
            >
              <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform sm:size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen text-blue-300/60">
          Loading...
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  )
}
