'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

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
    <form onSubmit={onSubmit}>
      <h1>Schritt 1: Einloggen</h1>
      <p>
        Als Studierender bist du bei Neuland Ingolstadt e.V. vom Mitgliedsbeitrag befreit.
      </p>
      <p>
        Um deinen Studierendenstatus zu verifizieren, schicken wir zunächst eine E-Mail an deine private E-Mail-Adresse um deine Identität zu verifizieren.
        Danach schicken wir eine E-Mail an deine THI-E-Mail-Adresse, um deine Hochschulzugehörigkeit zu überprüfen.
      </p>
      <p>
        Bitte gib die E-Mail-Adresse ein, die du auf deinem Mitgliedsantrag angegeben hast (nicht deine @neuland-ingolstadt.de Adresse):
      </p>
      <p>
        <strong>Private E-Mail-Adresse: </strong>
        <input type="email" name="email" required />
      </p>
      <input type="submit" value="Fortfahren" />
      {error && <p><strong>Fehler: </strong>{error}</p>}
    </form>
  )
}
