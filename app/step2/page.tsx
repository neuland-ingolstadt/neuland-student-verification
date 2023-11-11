'use client'

import { FormEvent } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function Page() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token') ?? ''

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/step2', {
      method: 'POST',
      body: formData,
    })

    if (response.status == 200) {
      const email = formData.get('email') as string
      router.push(`/step2/done?email=${encodeURIComponent(email)}`)
    } else {
      const { error } = await response.json()
      alert(error)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <p>
        Bitte gib deine THI-E-Mail-Adresse ein, um die Verifikation abzuschließen:
      </p>
      <input type="hidden" name="token" value={token} />
      <input type="email" name="email" pattern=".*@thi.de" required />
      <input type="submit" />
    </form>
  )
}
