'use client'

import { StepCard } from '@/components/step-card'

export default function Page() {
  return (
    <StepCard
      progress={100}
      title="Schritt 3: Verifikation abschließen"
      progressClassName="[&_[data-slot=progress-indicator]]:bg-emerald-600"
    >
      <p className="font-bold">
        Danke, dein Studierendenstatus wurde verifiziert!
      </p>
    </StepCard>
  )
}
