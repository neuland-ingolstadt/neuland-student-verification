'use client'

import { FormEvent } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function Page() {
  const params = useSearchParams()
  const token = params.get('token')
  const router = useRouter()

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/step1', {
      method: 'POST',
      body: formData,
    })

    if (response.status == 200) {
      const email = formData.get('email') as string
      router.push(`/step1/done?email=${encodeURIComponent(email)}`)
    } else {
      const { error } = await response.json()
      alert(error)
    }
  }
  
  return (
    <form onSubmit={onSubmit}>
      <p>
        Um deinen Studierendenstatus zu verifizieren, schicken wir zuerst eine E-Mail an deine private E-Mail-Adresse um deine Identität zu bestätigen.
        Danach schicken wir eine E-Mail an deine Hochschul-E-Mail-Adresse um deinen Studierendenstatus zu verifizieren.
      </p>
      <p>
        Bitte gib deine private E-Mail-Adresse ein, um fortzufahren:
      </p>
      <input type="email" name="email" required  />
      <input type="submit" />
    </form>
  )
}
