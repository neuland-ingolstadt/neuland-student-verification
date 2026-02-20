'use client'

import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Input } from '@heroui/input'
import { Button, Divider, Progress } from '@heroui/react'
import { ArrowRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { type FormEvent, Suspense, useState } from 'react'

function Page() {
  const params = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const token = params.get('token') ?? ''

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/step2', {
      method: 'POST',
      body: formData,
    })

    if (response.status === 200) {
      const email = formData.get('email') as string
      router.push(`/step2/done?email=${encodeURIComponent(email)}`)
    } else if (response.status === 400) {
      setError(
        'Das sieht nicht aus, wie die E-Mail eines Studierenden der Technischen Hochschule Ingolstadt. Deine E-Mail muss das Schema abc1234@thi.de besitzen.'
      )
    } else {
      setError(await response.text())
    }
  }

  return (
    <div>
      <Card className="p-3 gap-3">
        <CardHeader className="gap-6 items-start flex flex-col">
          <Progress
            aria-label="Verification..."
            size="md"
            value={33}
            showValueLabel={false}
          />

          <h1>Schritt 2: Hochschulzugehörigkeit verifizieren</h1>
        </CardHeader>

        <Divider />

        <CardBody className="gap-2">
          <p>
            Um deine Hochschulzugehörigkeit zu verifizieren, schicken wir nun
            eine E-Mail an deine Hochschul-Mail-Adresse.
          </p>
          <p>
            Bitte gib deine THI-E-Mail-Adresse ein, um deine
            Hochschulzugehörigkeit zu überprüfen. Um Missbrauch vorzubeugen,
            wird diese E-Mail-Adresse in unserer Mitgliederverwaltung
            gespeichert.
          </p>

          <p className="text-gray-500">
            Wenn du nicht an der THI studierst, kontaktiere uns bitte unter{' '}
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
            <div className="flex flex-col gap-2">
              <Input
                label="THI-E-Mail-Adresse"
                type="email"
                name="email"
                isInvalid={error !== null}
                errorMessage={error !== null && `Fehler: ${error}`}
                required
                onInput={() => setError(null)}
              />
              <input type="hidden" name="token" value={token} />

              <Button color="primary" type="submit" className="w-full">
                <span>Fortfahren</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function PageWrapper() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  )
}
