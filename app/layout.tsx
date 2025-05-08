import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type React from 'react'

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
    <html lang="en">
      <body className={inter.className}>
        <div className="container max-w-4xl pt-4">{children}</div>
      </body>
    </html>
  )
}
