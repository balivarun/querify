import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Querify',
  description: 'AI-powered search engine',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-zinc-950 text-white min-h-screen flex flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex-1">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}
