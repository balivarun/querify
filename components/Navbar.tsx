'use client'

import { Show, SignInButton, UserButton } from '@clerk/nextjs'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
      <a href="/" className="text-xl font-bold text-white tracking-tight">
        Querify
      </a>
      <div className="flex items-center gap-4">

        <Show when="signedOut">
          <SignInButton mode="modal">
            <button className="text-sm text-zinc-400 hover:text-white transition">
              Sign in
            </button>
          </SignInButton>
        </Show>

        <Show when="signedIn">
          <>
            <a href="/history" className="text-sm text-zinc-400 hover:text-white transition">
              History
            </a>
            <UserButton />
          </>
        </Show>

      </div>
    </nav>
  )
}