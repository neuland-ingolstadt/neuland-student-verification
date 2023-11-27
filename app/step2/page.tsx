'use client'

import { Button, Progress } from '@nextui-org/react'
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'
import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@nextui-org/input'
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
    const response = await fetch('/api/step2', {
      method: 'POST',
      body: formData
    })

    if (response.status === 200) {
      const email = formData.get('email') as string
      router.push(`/step2/done?email=${encodeURIComponent(email)}`)
    } else if (response.status === 400) {
      setError('Das sieht nicht aus, wie die E-Mail eines Studierenden der Technischen Hochschule Ingolstadt. Deine E-Mail muss das Schema abc1234@thi.de besitzen.')
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
              value={49.98}
              color={error === null ? 'primary' : 'danger'}
              showValueLabel={false}
            />
          </CardHeader>
          <CardBody>
            <center><h1>Schritt 2</h1></center>
            <p>
              Als Studierender bis du bei {CLUB_NAME} vom Mitgliedsbeitrag befreit.
            </p>
            <p>
              Bitte gib deine THI-E-Mail-Adresse ein, um deine Hochschulzugehörigkeit zu überprüfen:
            </p>
          </CardBody>
          <CardFooter>
            <form onSubmit={onSubmit} className={styles.full_width}>
              <div>
                <Input
                  label='THI-E-Mail-Adresse'
                  type='email'
                  name='email'
                  isInvalid={(error !== null)}
                  errorMessage={(error !== null) && 'Fehler: ' + error}
                  required
                />
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
