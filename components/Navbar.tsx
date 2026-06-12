'use client'

import { useAuth, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Search, History } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const { isSignedIn, isLoaded } = useAuth()

  return (
    <nav className="relative w-full flex items-center justify-between px-6 py-3 border-b border-blue-400/20 backdrop-blur-xl bg-gradient-to-r from-slate-950/80 via-blue-950/80 to-slate-950/80 sticky top-0 z-50 shadow-lg shadow-blue-500/10">

      {/* Navbar gradient glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/10 via-transparent to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0 group">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-lg px-2 py-0.5 text-sm font-bold group-hover:shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300">
          Q
        </div>
        <span className="text-white font-semibold text-lg tracking-tight group-hover:text-blue-200 transition-colors">
          Querify
        </span>
      </Link>

      {/* Middle search bar */}
      <div className="flex flex-1 max-w-md mx-6">
        <Link
          href="/"
          className="flex items-center gap-2 w-full bg-white/5 border border-blue-400/20 rounded-full px-4 py-2 text-blue-300/60 text-sm hover:border-blue-400/40 hover:bg-white/10 transition-all duration-300 group"
        >
          <Search size={14} className="group-hover:text-blue-300 transition-colors" />
          <span className="group-hover:text-blue-200 transition-colors">Search anything...</span>
        </Link>
      </div>

      {/* Right side auth */}
      <div className="flex items-center gap-3 shrink-0">
        {!isLoaded ? (
          <div className="flex gap-2">
            <div className="w-20 h-8 bg-blue-500/10 border border-blue-400/20 rounded-lg animate-pulse" />
            <div className="w-20 h-8 bg-blue-500/10 border border-blue-400/20 rounded-lg animate-pulse" />
          </div>
        ) : !isSignedIn ? (
          <div className="flex items-center gap-2">
            <SignInButton mode="modal">
              <button className="text-sm text-blue-200/70 hover:text-blue-100 px-4 py-1.5 rounded-lg border border-blue-400/30 hover:border-blue-400/60 hover:bg-blue-500/10 transition-all duration-300 backdrop-blur-sm">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium px-4 py-1.5 rounded-lg hover:from-blue-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-400/50">
                Sign up
              </button>
            </SignUpButton>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/history"
              className="flex items-center gap-1.5 text-sm text-blue-200/70 hover:text-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-all duration-300"
            >
              <History size={15} />
              <span>History</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-0.5">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-full h-full rounded-full',
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
