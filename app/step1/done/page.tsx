'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { StepCard } from '@/components/step-card'

function Page() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  return (
    <StepCard progress={33} title="Schritt 1: E-Mail verifizieren">
      <p className="font-semibold">Danke!</p>

      <p>
        Wir haben eine Email mit weiteren Anweisungen an{' '}
        <span className="text-blue-500">{email}</span> gesendet.
      </p>
    </StepCard>
  )
}

export default function PageWrapper() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  )
}
