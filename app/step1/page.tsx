'use client'

import { Button, Progress } from '@nextui-org/react'
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'
import { FormEvent, useState } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { Input } from '@nextui-org/input'
import styles from '@/app/page.module.css'
import { useRouter } from 'next/navigation'

const CLUB_NAME = process.env.NEXT_PUBLIC_CLUB_NAME as string
const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY as string

export default function Page () {
  const router = useRouter()
  const [verified, setVerified] = useState(false)
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
              value={0}
              showValueLabel={false}
            />
          </CardHeader>
          <CardBody>
            <h1 className="mb-2">Schritt 1: E-Mail verifizieren</h1>
            <p className="mb-2">
              Als Studierender bis du bei {CLUB_NAME} vom Mitgliedsbeitrag befreit.
            </p>
            <p className="mb-2">
              Um deinen Studierendenstatus zu verifizieren, schicken wir zunächst eine E-Mail an deine private
              E-Mail-Adresse um deine Identität zu verifizieren.
              Danach schicken wir eine E-Mail an deine Hochschul-Mail-Adresse, um deine Hochschulzugehörigkeit zu
              überprüfen.
            </p>
            <p>
              Bitte gibt die E-Mail-Adresse ein, die du auf deinem Mitgliedsantrag angegeben hast (<strong>nicht</strong> deine
              @neuland-ingolstadt.de Adresse). Wenn du diese Adresse nicht mehr weißt, kontaktiere uns bitte unter
              info@neuland-ingolstadt.de.
            </p>
          </CardBody>
          <CardFooter>
            <form onSubmit={onSubmit} className={styles.full_width}>
              <div className="mb-2">
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
                <HCaptcha
                  sitekey={HCAPTCHA_SITE_KEY}
                  onVerify={(token, ekey) => setVerified(true)}
                />
                <Button
                  className={styles.button}
                  color='primary'
                  type='submit'
                  isDisabled={!verified}
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
