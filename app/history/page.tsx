'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Trash2, Clock, ArrowRight } from 'lucide-react'

interface HistoryItem {
  query: string
  timestamp: number
}

const HISTORY_KEY = 'querify_history'

export function saveToHistory(query: string) {
  if (typeof window === 'undefined') return
  const existing: HistoryItem[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  const filtered = existing.filter((item) => item.query !== query)
  const updated = [{ query, timestamp: Date.now() }, ...filtered].slice(0, 50)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (stored) setHistory(JSON.parse(stored))
  }, [])

  const clearAll = () => {
    localStorage.removeItem(HISTORY_KEY)
    setHistory([])
  }

  const removeItem = (query: string) => {
    const updated = history.filter((h) => h.query !== query)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
    setHistory(updated)
  }

  const formatTime = (ts: number) => {
    const now = Date.now()
    const diff = now - ts
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="relative w-full min-h-screen">
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
      </div>

      <div className="fixed inset-0 -z-10 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Search History</h1>
            <p className="text-blue-300/50 text-sm">{history.length} saved searches</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 text-sm text-red-400/70 hover:text-red-400 border border-red-400/20 hover:border-red-400/40 px-3 py-1.5 rounded-lg transition-all duration-300"
            >
              <Trash2 size={14} />
              Clear all
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center mb-4">
              <Clock size={28} className="text-blue-400/40" />
            </div>
            <p className="text-blue-200/40 text-lg font-light mb-2">No searches yet</p>
            <p className="text-blue-300/30 text-sm">Your search history will appear here</p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 flex items-center gap-2 text-sm text-blue-300/60 hover:text-blue-200 border border-blue-400/20 hover:border-blue-400/40 px-4 py-2 rounded-full transition-all duration-300"
            >
              <Search size={14} />
              Start searching
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.timestamp}
                className="group flex items-center gap-3 bg-blue-500/5 backdrop-blur-sm border border-blue-400/20 rounded-xl px-4 py-3 hover:border-blue-400/40 hover:bg-blue-500/10 transition-all duration-300"
              >
                <Clock size={14} className="text-blue-400/40 shrink-0" />

                <button
                  onClick={() => router.push(`/search?q=${encodeURIComponent(item.query)}`)}
                  className="flex-1 text-left text-blue-100/80 group-hover:text-white transition-colors text-sm sm:text-base truncate"
                >
                  {item.query}
                </button>

                <span className="text-blue-300/30 text-xs shrink-0 hidden sm:block">
                  {formatTime(item.timestamp)}
                </span>

                <button
                  onClick={() => router.push(`/search?q=${encodeURIComponent(item.query)}`)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-blue-400/60 hover:text-blue-300"
                >
                  <ArrowRight size={14} />
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); removeItem(item.query) }}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-400/40 hover:text-red-400"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
