'use client'

import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Button, Checkbox, Divider, Progress } from '@heroui/react'
import { ArrowRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { type FormEvent, useState } from 'react'

export default function Page() {
  const params = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const token = params.get('token') ?? ''

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/step3', {
      method: 'POST',
      body: formData,
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
        <Card className="p-3 gap-3">
          <CardHeader className="gap-6 items-start flex flex-col">
            <Progress
              aria-label="Verification..."
              size="md"
              value={66}
              showValueLabel={false}
            />
            <h1>Schritt 3: Verifikation abschließen</h1>
          </CardHeader>

          <Divider />

          <CardBody className="gap-2">
            <p>
              Bitte schließe die Verifikation mit der Bestätigung deines
              Studierendenstatus ab.
            </p>
          </CardBody>

          <Divider />

          <CardFooter>
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-4">
                <Checkbox type="checkbox" id="isStudent" required>
                  Ich bestätige, dass ich am 15.03. dieses Jahres an der
                  Technischen Hochschule Ingolstadt immatriukliert war oder sein
                  werde.
                </Checkbox>
                <input type="hidden" name="token" value={token} />

                <Button color="primary" type="submit" className="w-full">
                  <span>Fortfahren</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
              {error && (
                <p className="text-red-400">
                  <strong>Fehler:</strong> {error}
                </p>
              )}
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
