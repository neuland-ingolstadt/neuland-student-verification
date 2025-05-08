'use client'

import { Card, CardBody, CardHeader } from '@heroui/card'
import { Divider, Progress } from '@heroui/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function Page() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  return (
    <>
      <div>
        <Card className="p-3 gap-3">
          <CardHeader className="flex flex-col items-start gap-6">
            <Progress
              aria-label="Verification..."
              size="md"
              value={66}
              showValueLabel={false}
            />
            <h1>Schritt 2: Hochschulzugehörigkeit verifizieren</h1>
          </CardHeader>

          <Divider />

          <CardBody className="gap-2">
            <p className="font-semibold">Danke!</p>

            <p>
              Wir haben eine Email mit weiteren Anweisungen an{' '}
              <span className="text-blue-500">{email}</span> gesendet.
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  )
}

export default function PageWrapper() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  )
}
