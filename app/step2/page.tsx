'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

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
    <form onSubmit={onSubmit}>
      <h1>Schritt 2: Hochschulzugehörigkeit überprüfen</h1>
      <p>
        Bitte gib deine THI-E-Mail-Adresse ein, um deine Hochschulzugehörigkeit zu überprüfen:
      </p>
      <p>
        <strong>THI-E-Mail-Adresse: </strong>
        <input type="email" name="email" required />
      </p>
      <input type="hidden" name="token" value={token} />
      <input type="submit" value="Fortfahren" />
      {error && <p><strong>Fehler: </strong>{error}</p>}
    </form>
  )
}
