'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const geometryRef = useRef<HTMLDivElement>(null)
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
        background: i % 2 === 0 ? 'rgba(59, 130, 246, 0.15)' : 'rgba(124, 58, 202, 0.15)',
      }))
    )
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY

      setMouseX(x)
      setMouseY(y)

      if (geometryRef.current) {
        const shapes = geometryRef.current.querySelectorAll('[data-shape]')
        shapes.forEach((shape, index) => {
          const speed = 0.05 + index * 0.02
          const moveX = (x - window.innerWidth / 2) * speed
          const moveY = (y - window.innerHeight / 2) * speed
          const rotate = (x / window.innerWidth) * 360

          ;(shape as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSearch = () => {
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div ref={containerRef} className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-0">

      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 animate-gradient" />
      </div>

      <div className="absolute inset-0 -z-10 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      <div ref={geometryRef} className="absolute inset-0 -z-10 overflow-hidden">
        <div
          data-shape="cube1"
          className="absolute w-48 sm:w-80 h-48 sm:h-80 top-1/4 left-1/4 transition-transform duration-700 will-change-transform"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
            borderRadius: '20px',
            border: '2px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 0 60px rgba(59, 130, 246, 0.15)',
          }}
        />

        <div
          data-shape="circle1"
          className="absolute w-56 sm:w-96 h-56 sm:h-96 top-1/3 right-1/4 transition-transform duration-700 will-change-transform"
          style={{
            borderRadius: '50%',
            border: '2px solid rgba(124, 58, 202, 0.3)',
            boxShadow: '0 0 80px rgba(124, 58, 202, 0.2)',
          }}
        />
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        {particles.map((style, i) => (
          <div
            key={i}
            className="particle absolute rounded-full opacity-20 blur-3xl"
            style={style}
          />
        ))}
      </div>

      <div className="relative z-10 mb-8 sm:mb-10 text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent animate-fade-in drop-shadow-lg">
          Querify
        </h1>
        <p className="text-blue-200/60 text-base sm:text-lg animate-fade-in-delay font-light">
          Ask anything. Get answers with real sources.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-2xl mb-6 sm:mb-8 group px-2">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative backdrop-blur-xl bg-white/5 border border-white/20 rounded-full px-4 sm:px-6 py-3 sm:py-4 focus-within:border-white/40 focus-within:bg-white/10 transition-all duration-300 shadow-2xl hover:shadow-blue-500/20">
          <div className="flex items-center gap-2 sm:gap-3">
            <Search size={16} className="text-blue-400/60 shrink-0 sm:size-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-white placeholder-blue-300/40 outline-none text-sm sm:text-base"
            />
            <button
              onClick={handleSearch}
              className="group/btn bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-1.5 sm:p-2 hover:bg-blue-400 hover:scale-110 transition-all duration-300 shrink-0 shadow-lg hover:shadow-blue-400/50"
            >
              <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform sm:size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center max-w-2xl px-2">
        {suggestions.map((s, i) => (
          <button
            key={s}
            onClick={() => {
              setQuery(s)
              router.push(`/search?q=${encodeURIComponent(s)}`)
            }}
            className="text-xs sm:text-sm text-blue-200/70 border border-blue-400/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 hover:border-blue-400/60 hover:text-blue-100 hover:bg-blue-500/10 transition-all duration-300 backdrop-blur-sm hover:scale-105 font-light"
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

      <div className="absolute bottom-4 sm:bottom-8 left-4 text-blue-300/40 text-xs sm:text-sm font-light animate-pulse">
        Move your mouse to explore
      </div>
    </div>
  )
}
