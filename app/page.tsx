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
    <div ref={containerRef} className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center px-4">

      {/* Background gradient */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 animate-gradient" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      {/* Geometric shapes that follow mouse */}
      <div ref={geometryRef} className="absolute inset-0 -z-10 overflow-hidden">
        {/* Large floating cube */}
        <div
          data-shape="cube1"
          className="absolute w-80 h-80 top-1/4 left-1/4 transition-transform duration-700 will-change-transform"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
            borderRadius: '20px',
            border: '2px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 0 60px rgba(59, 130, 246, 0.15)',
          }}
        />

        {/* Rotating circle */}
        <div
          data-shape="circle1"
          className="absolute w-96 h-96 top-1/3 right-1/4 transition-transform duration-700 will-change-transform"
          style={{
            borderRadius: '50%',
            border: '2px solid rgba(124, 58, 202, 0.3)',
            boxShadow: '0 0 80px rgba(124, 58, 202, 0.2), inset 0 0 80px rgba(124, 58, 202, 0.1)',
          }}
        />

        {/* Diagonal line */}
        <div
          data-shape="line1"
          className="absolute w-1/2 h-1/2 top-1/4 left-1/3 transition-transform duration-700 will-change-transform"
          style={{
            borderTop: '3px solid rgba(59, 130, 246, 0.3)',
            opacity: 0.5,
            transform: 'rotate(45deg)',
          }}
        />

        {/* Floating orb with glow */}
        <div
          data-shape="orb1"
          className="absolute w-64 h-64 bottom-1/4 right-1/3 transition-transform duration-700 will-change-transform"
          style={{
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
            filter: 'blur(40px)',
            boxShadow: '0 0 100px rgba(59, 130, 246, 0.25)',
          }}
        />

        {/* Square grid */}
        <div
          data-shape="grid1"
          className="absolute w-96 h-96 top-1/2 right-1/4 transition-transform duration-700 will-change-transform"
          style={{
            backgroundImage: 'linear-gradient(rgba(124, 58, 202, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(124, 58, 202, 0.2) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            opacity: 0.4,
          }}
        />

        {/* Pulsing corner accent */}
        <div
          data-shape="accent"
          className="absolute w-48 h-48 bottom-1/3 left-1/4 transition-transform duration-700 will-change-transform"
          style={{
            borderRight: '3px solid rgba(59, 130, 246, 0.4)',
            borderBottom: '3px solid rgba(59, 130, 246, 0.4)',
            animation: 'pulse 3s ease-in-out infinite',
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {particles.map((style, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 blur-3xl"
            style={style}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mb-10 text-center max-w-2xl">
        <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent animate-fade-in drop-shadow-lg">
          Querify
        </h1>
        <p className="text-blue-200/60 text-lg animate-fade-in-delay font-light">
          Ask anything. Get answers with real sources.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative z-10 w-full max-w-2xl mb-8 group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative backdrop-blur-xl bg-white/5 border border-white/20 rounded-full px-6 py-4 focus-within:border-white/40 focus-within:bg-white/10 transition-all duration-300 shadow-2xl hover:shadow-blue-500/20">
          <div className="flex items-center gap-3">
            <Search size={18} className="text-blue-400/60 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-white placeholder-blue-300/40 outline-none text-base"
            />
            <button
              onClick={handleSearch}
              className="group/btn bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-2.5 hover:from-blue-400 hover:to-blue-500 hover:scale-110 transition-all duration-300 shrink-0 shadow-lg hover:shadow-blue-400/50"
            >
              <ArrowRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
        {suggestions.map((s, i) => (
          <button
            key={s}
            onClick={() => {
              setQuery(s)
              router.push(`/search?q=${encodeURIComponent(s)}`)
            }}
            className="text-sm text-blue-200/70 border border-blue-400/30 rounded-full px-4 py-2 hover:border-blue-400/60 hover:text-blue-100 hover:bg-blue-500/10 transition-all duration-300 backdrop-blur-sm hover:scale-105 font-light"
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

      {/* Bottom hint */}
      <div className="absolute bottom-8 left-8 text-blue-300/40 text-sm font-light animate-pulse">
        Move your mouse to explore geometric shapes
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
