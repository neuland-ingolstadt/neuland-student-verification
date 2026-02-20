'use client'

import HCaptcha from '@hcaptcha/react-hcaptcha'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Input } from '@heroui/input'
import { Button, Divider, Progress } from '@heroui/react'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FormEvent, useRef, useState } from 'react'

const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY as string

const IGNORE_HCAPTCHA =
  (process.env.NEXT_PUBLIC_IGNORE_HCAPTCHA || 'false') === 'true'

export default function Page() {
  const router = useRouter()
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const captchaRef = useRef<HCaptcha | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/step1', {
      method: 'POST',
      body: formData,
    })

    captchaRef.current?.resetCaptcha()

    if (response.status === 200) {
      const email = formData.get('email') as string
      router.push(`/step1/done?email=${encodeURIComponent(email)}`)
    } else if (response.status === 404) {
      setError(
        'Diese E-Mail-Adresse ist uns nicht bekannt. Falls du dich nicht mehr erinnern kannst, welche E-Mail-Adresse du verwendet hast, kontaktiere uns bitte unter info@neuland-ingolstadt.de.'
      )
    } else {
      setError(await response.text())
    }
  }

  return (
    <div>
      <Card className="p-3 gap-3">
        <CardHeader className="flex flex-col items-start gap-6">
          <Progress
            aria-label="Verification..."
            size="md"
            value={0}
            showValueLabel={false}
          />
          <h1>Schritt 1: E-Mail verifizieren</h1>
        </CardHeader>

        <Divider />

        <CardBody className="gap-2">
          <p className="font-semibold">
            Als Studierender bist du bei Neuland Ingolstadt e.V. vom
            Mitgliedsbeitrag befreit.
          </p>
          <p>
            Um deinen Studierendenstatus zu verifizieren, schicken wir zunächst
            eine E-Mail an deine private E-Mail-Adresse um deine Identität zu
            verifizieren. Danach schicken wir eine E-Mail an deine
            Hochschul-Mail-Adresse, um deine Hochschulzugehörigkeit zu
            überprüfen.
          </p>
          <p>
            Bitte gib die E-Mail-Adresse ein, die du auf deinem Mitgliedsantrag
            angegeben hast (<strong>nicht</strong> deine @neuland-ingolstadt.de
            Adresse).
            <br />
          </p>

          <p className="text-gray-500">
            Wenn du diese Adresse nicht mehr weißt, kontaktiere uns bitte unter{' '}
            <a
              href="mailto:info@neuland-ingolstadt.de"
              className="text-blue-500"
            >
              info@neuland-ingolstadt.de
            </a>
            .
          </p>
        </CardBody>

        <Divider />

        <CardFooter>
          <form onSubmit={onSubmit} className="w-full">
            <div className="mb-2">
              <Input
                label="Private E-Mail-Adresse"
                type="email"
                name="email"
                isInvalid={error !== null}
                errorMessage={error !== null && `Fehler: ${error}`}
                onInput={() => setError(null)}
                required
              />
            </div>
            <center>
              {!IGNORE_HCAPTCHA && (
                <HCaptcha
                  ref={captchaRef}
                  sitekey={HCAPTCHA_SITE_KEY}
                  onVerify={(_token, _ekey) => setVerified(true)}
                />
              )}
              <Button
                color="primary"
                type="submit"
                className="w-full"
                isDisabled={!verified && !IGNORE_HCAPTCHA}
              >
                <span>Fortfahren</span>
                <ArrowRight size={16} />
              </Button>
            </center>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
