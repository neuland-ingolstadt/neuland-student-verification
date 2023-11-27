'use client'

import { Button, Checkbox, Progress } from '@nextui-org/react'
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'
import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from '@/app/page.module.css'

const CLUB_NAME = process.env.NEXT_PUBLIC_CLUB_NAME as string

export default function Page () {
  const params = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const token = params.get('token') ?? ''

  async function onSubmit (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/step3', {
      method: 'POST',
      body: formData
    })

    if (response.status === 200) {
      router.push('/step3/done')
    } else {
      setError(await response.text())
    }
  }

  return (
    <>
      <div>
        <Card className={styles.container}>
          <CardHeader>
            <Progress
              aria-label='Verification...'
              size='md'
              value={83.3}
              color={error === null ? 'primary' : 'danger'}
              showValueLabel={false}
            />
          </CardHeader>
          <CardBody>
            <center><h1>Schritt 3</h1></center>
            <p>
              Als Studierender bis du bei {CLUB_NAME} vom Mitgliedsbeitrag befreit.
            </p>
            <p>
              Bitte schließe die Verifikation mit der Bestätigung deines Studierendenstatus ab.
            </p>
          </CardBody>
          <CardFooter>
            <form onSubmit={onSubmit} className={styles.full_width}>
              <div>
                <Checkbox
                  type='checkbox'
                  id='isStudent'
                  required
                >
                  Ich bestätige, dass ich am 15.03. dieses Jahres an der Technischen Hochschule Ingolstadt immatriukliert war oder sein werde.
                </Checkbox>
                <input type="hidden" name="token" value={token} />
              </div>
              <center>
                <Button
                  className={styles.button}
                  color='primary'
                  type='submit'
                >
                  Fortfahren
                </Button>
              </center>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
