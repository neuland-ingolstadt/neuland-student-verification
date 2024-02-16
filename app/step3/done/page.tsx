'use client'

import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Progress } from '@nextui-org/react'
import styles from '@/app/page.module.css'

export default function Page () {
  return (
    <>
      <div>
        <Card className={styles.container}>
          <CardHeader>
            <Progress
              aria-label='Verification...'
              size='md'
              value={100}
              color='success'
              showValueLabel={false}
            />
          </CardHeader>
          <CardBody>
            <h1 className="mb-2">Schritt 3: Verifikation abschließen</h1>
            <p>
              Danke, dein Studierendenstatus wurde verifiziert!
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
