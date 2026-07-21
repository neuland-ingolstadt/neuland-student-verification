'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { StepCard } from '@/components/step-card'
import { SubmitButton } from '@/components/submit-button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import type { Step3Error } from '@/lib/action-result'
import { submitStep3 } from './actions'

const formSchema = z.object({
  confirmed: z
    .boolean()
    .refine(
      (value) => value,
      'Bitte bestätige deinen Studierendenstatus, um fortzufahren.'
    ),
})

type FormValues = z.infer<typeof formSchema>

const ERROR_MESSAGES: Record<Step3Error, string> = {
  token_expired:
    'Der Link ist abgelaufen. Bitte starte die Verifikation von vorne.',
  token_invalid:
    'Der Link ist ungültig. Bitte verwende den Link aus unserer E-Mail.',
  backend:
    'Unsere Mitgliederverwaltung ist derzeit nicht erreichbar. Bitte versuche es später erneut oder kontaktiere uns unter info@neuland-ingolstadt.de.',
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
      confirmed: false,
    },
  })

  async function onSubmit(_data: FormValues) {
    const result = await submitStep3(token)

    if (result.ok) {
      router.push('/step3/done')
    } else {
      form.setError('root', { message: ERROR_MESSAGES[result.error] })
    }
  }

  return (
    <StepCard
      progress={66}
      title="Schritt 3: Verifikation abschließen"
      footer={
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full"
          noValidate
        >
          <div className="flex flex-col gap-4">
            <Controller
              name="confirmed"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Field orientation="horizontal">
                    <Checkbox
                      id="isStudent"
                      checked={field.value}
                      aria-invalid={fieldState.invalid}
                      onCheckedChange={(checked) => {
                        field.onChange(checked === true)
                        form.clearErrors('root')
                      }}
                    />
                    <FieldLabel htmlFor="isStudent" className="font-normal">
                      Ich bestätige, dass ich am 15.03. dieses Jahres an der
                      Technischen Hochschule Ingolstadt immatrikuliert war oder
                      sein werde.
                    </FieldLabel>
                  </Field>
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
      <p>
        Bitte schließe die Verifikation mit der Bestätigung deines
        Studierendenstatus ab.
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
