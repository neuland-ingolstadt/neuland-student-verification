'use client'

import { Button, Progress } from '@nextui-org/react'
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'
import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@nextui-org/input'
import styles from '@/app/page.module.css'

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
              value={33}
              showValueLabel={false}
            />
          </CardHeader>
          <CardBody>
            <h1 className="mb-2">Schritt 2: Hochschulzugehörigkeit verifizieren</h1>
            <p className="mb-2">
              Um deine Hochschulzugehörigkeit zu verifizieren, schicken wir nun eine E-Mail an deine Hochschul-Mail-Adresse.
            </p>
            <p className="mb-2">
              Bitte gib deine THI-E-Mail-Adresse ein, um deine Hochschulzugehörigkeit zu überprüfen.
              Um Missbrauch vorzubeugen, wird diese E-Mail-Adresse in unserer Mitgliederverwaltung gespeichert.
              Wenn du nicht an der THI studierst, kontaktiere uns bitte unter info@neuland-ingolstadt.de.
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
