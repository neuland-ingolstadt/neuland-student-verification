'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent } from 'react'

export default function Page () {
  const params = useSearchParams()
  const router = useRouter()
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
      alert(await response.text())
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Schritt 3: Abschließen</h1>
      <p>
        Bitte schließe die Verifikation deines Studierendenstatus ab.
      </p>
      <p>
        <input type="checkbox" id="isStudent" required />
        <label htmlFor="isStudent">Ich bestätige, dass ich am 15.03. dieses Jahres an der Technischen Hochschule Ingolstadt immatriukliert war oder sein werde.</label>
      </p>
      <input type="hidden" name="token" value={token} />
      <input type="submit" />
    </form>
  )
}
