'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight } from 'lucide-react'

const suggestions = [
  'What is quantum computing?',
  'Latest AI news today',
  'How does React work?',
  'Best free APIs for developers',
]

export default function HomePage() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4">

      <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold text-white mb-3">Querify</h1>
        <p className="text-zinc-400 text-lg">Ask anything. Get answers with real sources.</p>
      </div>

      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3 focus-within:border-zinc-500 transition">
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
            className="bg-white text-black rounded-full p-1.5 hover:bg-zinc-200 transition shrink-0"
          >
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-5 justify-center">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s)
                router.push(`/search?q=${encodeURIComponent(s)}`)
              }}
              className="text-sm text-zinc-400 border border-zinc-700 rounded-full px-4 py-1.5 hover:border-zinc-500 hover:text-white transition"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}