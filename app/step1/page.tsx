'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { StepCard } from '@/components/step-card'
import { SubmitButton } from '@/components/submit-button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { Step1Error } from '@/lib/action-result'
import { verifyClient } from '@/lib/altcha/client'
import { submitStep1 } from './actions'

const formSchema = z.object({
  email: z.email('Bitte gib eine gültige E-Mail-Adresse ein.'),
})

type FormValues = z.infer<typeof formSchema>

const ERROR_MESSAGES: Record<Step1Error, string> = {
  captcha:
    'Die Bot-Schutz-Verifizierung ist fehlgeschlagen. Bitte versuche es erneut.',
  invalid_email: 'Bitte gib eine gültige E-Mail-Adresse ein.',
  not_found:
    'Diese E-Mail-Adresse ist uns nicht bekannt. Falls du dich nicht mehr erinnern kannst, welche E-Mail-Adresse du verwendet hast, kontaktiere uns bitte unter info@neuland-ingolstadt.de.',
  backend:
    'Unsere Mitgliederverwaltung ist derzeit nicht erreichbar. Bitte versuche es später erneut oder kontaktiere uns unter info@neuland-ingolstadt.de.',
  unknown:
    'Ein unbekannter Fehler ist aufgetreten. Bitte versuche es später erneut.',
}

export default function Page() {
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(data: FormValues) {
    const altcha = await verifyClient()

    if (!altcha.solution) {
      form.setError('root', { message: ERROR_MESSAGES.captcha })
      return
    }

    const result = await submitStep1(data.email, {
      challenge: altcha.challenge,
      solution: altcha.solution,
    })

    if (result.ok) {
      router.push(`/step1/done?email=${encodeURIComponent(data.email)}`)
    } else {
      form.setError('root', { message: ERROR_MESSAGES[result.error] })
    }
  }

  return (
    <StepCard
      progress={0}
      title="Schritt 1: E-Mail verifizieren"
      footer={
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full"
          noValidate
        >
          <div className="mb-2">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">
                    Private E-Mail-Adresse
                  </FieldLabel>
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
              <FieldError className="mt-2">
                Fehler: {form.formState.errors.root.message}
              </FieldError>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <SubmitButton
              loading={
                form.formState.isSubmitting || form.formState.isSubmitSuccessful
              }
            >
              Fortfahren
            </SubmitButton>
          </div>
        </form>
      }
    >
      <p className="font-semibold">
        Als Studierender zahlst du bei Neuland Ingolstadt e.V. einen ermäßigten
        Mitgliedsbeitrag.
      </p>
      <p>
        Um deinen Studierendenstatus zu verifizieren, schicken wir zunächst eine
        E-Mail an deine private E-Mail-Adresse um deine Identität zu
        verifizieren. Danach schicken wir eine E-Mail an deine
        Hochschul-Mail-Adresse, um deine Hochschulzugehörigkeit zu überprüfen.
      </p>
      <p>
        Bitte gib die E-Mail-Adresse ein, die du auf deinem Mitgliedsantrag
        angegeben hast (<strong>nicht</strong> deine @neuland-ingolstadt.de
        Adresse).
        <br />
      </p>

      <p className="text-gray-500">
        Wenn du diese Adresse nicht mehr weißt, kontaktiere uns bitte unter{' '}
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
