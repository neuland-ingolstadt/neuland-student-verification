'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { StepCard } from '@/components/step-card'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { Step2Error } from '@/lib/action-result'
import { submitStep2 } from './actions'

const formSchema = z.object({
  email: z
    .string()
    .regex(
      /^[a-z]{3}[0-9]{4}@thi\.de$/i,
      'Das sieht nicht aus, wie die E-Mail eines Studierenden der Technischen Hochschule Ingolstadt. Deine E-Mail muss das Schema abc1234@thi.de besitzen.'
    ),
})

type FormValues = z.infer<typeof formSchema>

const ERROR_MESSAGES: Record<Step2Error, string> = {
  invalid_email:
    'Das sieht nicht aus, wie die E-Mail eines Studierenden der Technischen Hochschule Ingolstadt. Deine E-Mail muss das Schema abc1234@thi.de besitzen.',
  token_expired:
    'Der Link ist abgelaufen. Bitte starte die Verifikation von vorne.',
  token_invalid:
    'Der Link ist ungültig. Bitte verwende den Link aus unserer E-Mail.',
  unknown:
    'Ein unbekannter Fehler ist aufgetreten. Bitte versuche es später erneut.',
}

function Page() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token') ?? ''

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(data: FormValues) {
    const result = await submitStep2(token, data.email)

    if (result.ok) {
      router.push(`/step2/done?email=${encodeURIComponent(data.email)}`)
    } else {
      form.setError('root', { message: ERROR_MESSAGES[result.error] })
    }
  }

  return (
    <StepCard
      progress={33}
      title="Schritt 2: Hochschulzugehörigkeit verifizieren"
      footer={
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">THI-E-Mail-Adresse</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                    onChange={(event) => {
                      field.onChange(event)
                      form.clearErrors('root')
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {form.formState.errors.root && (
              <FieldError>
                Fehler: {form.formState.errors.root.message}
              </FieldError>
            )}

            <Button
              variant="default"
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              <span>Fortfahren</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </form>
      }
    >
      <p>
        Um deine Hochschulzugehörigkeit zu verifizieren, schicken wir nun eine
        E-Mail an deine Hochschul-Mail-Adresse.
      </p>
      <p>
        Bitte gib deine THI-E-Mail-Adresse ein, um deine Hochschulzugehörigkeit
        zu überprüfen. Um Missbrauch vorzubeugen, wird diese E-Mail-Adresse in
        unserer Mitgliederverwaltung gespeichert.
      </p>

      <p className="text-gray-500">
        Wenn du nicht an der THI studierst, kontaktiere uns bitte unter{' '}
        <a
          href="mailto:info@neuland-ingolstadt.de"
          className="text-emerald-600"
        >
          info@neuland-ingolstadt.de
        </a>
        .
      </p>
    </StepCard>
  )
}

export default function PageWrapper() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  )
}
