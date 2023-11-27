'use client'

import { Button, Progress } from '@nextui-org/react'
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'
import { FormEvent, useState } from 'react'
import { Input } from '@nextui-org/input'
import styles from '@/app/page.module.css'
import { useRouter } from 'next/navigation'

const CLUB_NAME = process.env.NEXT_PUBLIC_CLUB_NAME as string

export default function Page () {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  async function onSubmit (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/step1', {
      method: 'POST',
      body: formData
    })

    if (response.status === 200) {
      const email = formData.get('email') as string
      router.push(`/step1/done?email=${encodeURIComponent(email)}`)
    } else if (response.status === 404) {
      setError('Diese E-Mail-Adresse ist uns nicht bekannt. Falls du dich nicht mehr erinnern kannst, welche E-Mail-Adresse du verwendet hast, kontaktiere uns bitte unter info@neuland-ingolstadt.de.')
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
              value={16.66}
              color={error === null ? 'primary' : 'danger'}
              showValueLabel={false}
            />
          </CardHeader>
          <CardBody>
            <center><h1>Schritt 1</h1></center>
            <p>
              Als Studierender bis du bei {CLUB_NAME} vom Mitgliedsbeitrag befreit.
            </p>
            <p>
              Um deinen Studierendenstatus zu verifizieren, schicken wir zunächst eine E-Mail an deine private
              E-Mail-Adresse um deine Identität zu verifizieren.
              Danach schicken wir eine E-Mail an deine Hochschul-Mail-Adresse, um deine Hochschulzugehörigkeit zu
              überprüfen.
            </p>
            <p>
              Bitte gibt die E-Mail-Adresse ein, die du auf deinem Mitgleidsantrag angegeben hast (nicht deine
              @neuland-ingolstadt.de Adresse)
            </p>
          </CardBody>
          <CardFooter>
            <form onSubmit={onSubmit} className={styles.full_width}>
              <div>
                <Input
                  label='Private E-Mail-Adresse'
                  type='email'
                  name='email'
                  isInvalid={(error !== null)}
                  errorMessage={(error !== null) && 'Fehler: ' + error}
                  required
                />
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
