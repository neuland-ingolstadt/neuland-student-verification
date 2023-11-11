'use client'

import { useState, FormEvent } from "react"
import { useSearchParams } from "next/navigation"

export default function Page() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  return (
    <div>
        Danke, wir haben eine Email mit weiteren Anweisungen an <strong>{email}</strong> gesendet.
    </div>
  )
}
