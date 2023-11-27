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
            <center>
              Danke, dein Studierendenstatus wurde verifiziert!
            </center>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
