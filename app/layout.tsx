import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Studierendenstatus verifizieren',
  description: 'Studierendenstatus verifizieren'
}

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
