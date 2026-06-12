'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight } from 'lucide-react'

const suggestions = [
  'What is quantum computing?',
  'Latest AI news today',
  'How does React work?',
  'Best free APIs for developers',
]

interface ParticleStyle {
  width: string
  height: string
  left: string
  top: string
  animation: string
  animationDelay: string
  background: string
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [particles, setParticles] = useState<ParticleStyle[]>([])
  const router = useRouter()

  useEffect(() => {
    setParticles(
      [...Array(6)].map((_, i) => ({
        width: `${150 + i * 50}px`,
        height: `${150 + i * 50}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `float ${15 + i * 5}s ease-in-out infinite`,
        animationDelay: `${i * 2}s`,
        background: i % 2 === 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(124, 58, 202, 0.1)',
      }))
    )
  }, [])

  const handleSearch = () => {
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="relative w-full min-h-[90vh] overflow-hidden flex flex-col items-center justify-center px-4">

      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-blue-950 to-zinc-950 animate-gradient" />
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        {particles.map((style, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 blur-xl"
            style={style}
          />
        ))}
      </div>

      <div className="relative z-10 mb-10 text-center max-w-2xl">
        <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent animate-fade-in">
          Querify
        </h1>
        <p className="text-zinc-300 text-lg animate-fade-in-delay">
          Ask anything. Get answers with real sources.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-2xl mb-8">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-5 py-3 focus-within:border-white/40 focus-within:bg-white/15 transition-all duration-300 shadow-2xl hover:shadow-blue-500/10 hover:shadow-2xl">
          <div className="flex items-center gap-3">
            <Search size={18} className="text-zinc-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-base"
            />
            <button
              onClick={handleSearch}
              className="group bg-white text-black rounded-full p-2 hover:bg-blue-400 hover:scale-110 transition-all duration-300 shrink-0 shadow-lg hover:shadow-blue-400/50"
            >
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
        {suggestions.map((s, i) => (
          <button
            key={s}
            onClick={() => {
              setQuery(s)
              router.push(`/search?q=${encodeURIComponent(s)}`)
            }}
            className="text-sm text-zinc-300 border border-zinc-600 rounded-full px-4 py-2 hover:border-white hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:scale-105 transform"
            style={{
              animation: `fade-up 0.6s ease-out forwards`,
              animationDelay: `${i * 0.1}s`,
              opacity: 0,
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
