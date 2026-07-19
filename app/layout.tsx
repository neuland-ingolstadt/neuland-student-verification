import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type React from 'react'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Studierendenstatus verifizieren',
  description: 'Studierendenstatus verifizieren',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="container mx-auto max-w-4xl pt-4">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
