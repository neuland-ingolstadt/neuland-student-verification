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
              value={33.32}
              color='success'
              showValueLabel={false}
            />
          </CardHeader>
          <CardBody>
            <center>
              Danke, wir haben eine Email mit weiteren Anweisungen an <strong>{email}</strong> gesendet.
            </center>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
