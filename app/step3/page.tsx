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
      <input type="hidden" name="token" value={token} />
      <input type="submit" value="Verifikation abschließen" />
    </form>
  )
}
