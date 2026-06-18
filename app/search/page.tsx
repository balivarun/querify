'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense, useRef } from 'react'
import { Search, ExternalLink, ArrowRight, Copy, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { saveToHistory } from '../history/page'

interface Source {
  title: string
  url: string
  snippet: string
}

const markdownComponents = {
  h1: ({ children }: any) => <h1 className="text-xl font-bold text-white mb-3 mt-4 first:mt-0">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-lg font-bold text-blue-200 mb-2 mt-4 first:mt-0">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-base font-semibold text-blue-200 mb-2 mt-3 first:mt-0">{children}</h3>,
  p: ({ children }: any) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
  strong: ({ children }: any) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }: any) => <em className="italic text-blue-100">{children}</em>,
  ul: ({ children }: any) => <ul className="list-disc list-inside mb-3 space-y-1 text-blue-200/80">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal list-inside mb-3 space-y-1 text-blue-200/80">{children}</ol>,
  li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }: any) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
      {children}
    </a>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-blue-400/40 pl-4 italic text-blue-200/60 my-3">{children}</blockquote>
  ),
  pre: ({ children }: any) => (
    <pre className="bg-slate-900 border border-blue-400/20 rounded-xl p-4 overflow-x-auto mb-3 text-sm">{children}</pre>
  ),
  code: ({ children, className }: any) => {
    const isBlock = !!className
    return (
      <code className={isBlock ? 'text-blue-100 font-mono' : 'bg-blue-900/30 px-1.5 py-0.5 rounded text-blue-200 font-mono text-sm'}>
        {children}
      </code>
    )
  },
  hr: () => <hr className="border-blue-400/20 my-4" />,
}

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const router = useRouter()
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(true)
  const [answerDone, setAnswerDone] = useState(false)
  const [followUp, setFollowUp] = useState('')
  const [copied, setCopied] = useState(false)
  const [relatedQuestions, setRelatedQuestions] = useState<string[]>([])
  const geometryRef = useRef<HTMLDivElement>(null)
  const answerRef = useRef('')

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
    setAnswerDone(false)
    setRelatedQuestions([])
    answerRef.current = ''

    saveToHistory(query)

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
          const chunk = decoder.decode(value)
          answerRef.current += chunk
          setAnswer((prev) => prev + chunk)
        }

        setAnswerDone(true)
      } catch {
        setLoading(false)
        setAnswer('Something went wrong. Please try again.')
        setAnswerDone(true)
      }
    }

    fetchAnswer()
  }, [query])

  useEffect(() => {
    if (!answerDone || !answerRef.current) return

    fetch('/api/related', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, answer: answerRef.current }),
    })
      .then((r) => r.json())
      .then((data) => setRelatedQuestions(data.questions || []))
      .catch(() => {})
  }, [answerDone, query])

  const handleFollowUp = () => {
    if (!followUp.trim()) return
    router.push(`/search?q=${encodeURIComponent(followUp.trim())}`)
    setFollowUp('')
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(answerRef.current)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

        {/* Sources */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-xs sm:text-sm font-medium text-blue-300/70 uppercase tracking-wide mb-3 sm:mb-4">Sources</h2>

          {loading ? (
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 w-40 sm:w-56 bg-blue-500/10 border border-blue-400/20 rounded-xl animate-pulse" />
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

        {/* Answer */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-xs sm:text-sm font-medium text-blue-300/70 uppercase tracking-wide">Answer</h2>
            {answer && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-blue-300/50 hover:text-blue-200 border border-blue-400/20 hover:border-blue-400/40 px-2.5 py-1 rounded-lg transition-all duration-300"
              >
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>

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
            <div className="text-blue-200/80 text-sm sm:text-base bg-blue-500/5 backdrop-blur-sm border border-blue-400/20 rounded-xl p-4 sm:p-6">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {answer}
              </ReactMarkdown>
              {!answerDone && <span className="animate-pulse inline-block ml-0.5">▍</span>}
            </div>
          )}
        </div>

        {/* Related Questions */}
        {relatedQuestions.length > 0 && (
          <div className="mb-8 sm:mb-10">
            <h2 className="text-xs sm:text-sm font-medium text-blue-300/70 uppercase tracking-wide mb-3 sm:mb-4">Related Questions</h2>
            <div className="flex flex-wrap gap-2">
              {relatedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => router.push(`/search?q=${encodeURIComponent(q)}`)}
                  className="text-xs sm:text-sm text-blue-200/70 border border-blue-400/30 rounded-full px-3 sm:px-4 py-1.5 hover:border-blue-400/60 hover:text-blue-100 hover:bg-blue-500/10 transition-all duration-300 backdrop-blur-sm hover:scale-105 text-left"
                  style={{ animation: `fade-up 0.5s ease-out ${i * 0.1}s both` }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Follow-up */}
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
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-blue-300/60">Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}
