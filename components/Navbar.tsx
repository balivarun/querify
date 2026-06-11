'use client'

import { useAuth, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Search, History } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const { isSignedIn, isLoaded } = useAuth()

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">

      <Link href="/" className="flex items-center gap-2 shrink-0">
        <div className="bg-white text-black rounded-lg px-2 py-0.5 text-sm font-bold">
          Q
        </div>
        <span className="text-white font-semibold text-lg tracking-tight">
          Querify
        </span>
      </Link>

      <div className="flex flex-1 max-w-md mx-6">
        <Link
          href="/"
          className="flex items-center gap-2 w-full bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 text-zinc-500 text-sm hover:border-zinc-500 transition"
        >
          <Search size={14} />
          <span>Search anything...</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {!isLoaded ? (
          <div className="flex gap-2">
            <div className="w-16 h-8 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="w-16 h-8 bg-zinc-800 rounded-lg animate-pulse" />
          </div>
        ) : !isSignedIn ? (
          <div className="flex items-center gap-2">
            <SignInButton mode="modal">
              <button className="text-sm text-zinc-300 hover:text-white px-4 py-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-sm bg-white text-black font-medium px-4 py-1.5 rounded-lg hover:bg-zinc-200 transition">
                Sign up
              </button>
            </SignUpButton>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/history"
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition"
            >
              <History size={15} />
              <span>History</span>
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            />
          </div>
        )}
      </div>

    </nav>
  )
}
