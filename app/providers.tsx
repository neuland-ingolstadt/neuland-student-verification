'use client'

import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider as NextThemeProvider } from 'next-themes'
import type React from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <NextThemeProvider
        attribute="class"
        defaultTheme="light"
        themes={['light', 'dark']}
      >
        {children}
      </NextThemeProvider>
    </HeroUIProvider>
  )
}
