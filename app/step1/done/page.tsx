'use client'

import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Progress } from '@nextui-org/react'
import styles from '@/app/page.module.css'
import { useSearchParams } from 'next/navigation'

export default function Page () {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  return (
    <>
      <div>
        <Card className={styles.container}>
          <CardHeader>
            <Progress
              aria-label='Verification...'
              size='md'
              value={33}
              showValueLabel={false}
            />
          </CardHeader>
          <CardBody>
            <h1 className="mb-2">Schritt 1: E-Mail verifizieren</h1>
            <p>
              Danke! Wir haben eine Email mit weiteren Anweisungen an {email} gesendet.
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
