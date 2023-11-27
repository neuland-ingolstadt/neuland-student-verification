'use client'

import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { NextUIProvider } from '@nextui-org/react'
import React from 'react'

export default function Providers ({ children }: { children: React.ReactNode}) {
  return (
    <NextUIProvider>
      <NextThemeProvider
        attribute='class'
        defaultTheme='light'
        themes={['light', 'dark']}
      >
        {children}
      </NextThemeProvider>
    </NextUIProvider>
  )
}
