'use server'

import jwt from 'jsonwebtoken'
import * as z from 'zod'
import { getUserManagement } from '@/etc/user-management'
import type { ActionResult, Step1Error } from '@/lib/action-result'
import { JWT_SECRET } from '@/lib/utils'
import Step1VerificationEmail from '@/mail/step1'
import { sendEmail } from '@/services/azure'

async function verifyCaptcha(hCaptchaResponse: string): Promise<boolean> {
  if (process.env.NEXT_PUBLIC_IGNORE_HCAPTCHA === 'true') {
    return true
  }

  const resp = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    body: new URLSearchParams({
      response: hCaptchaResponse,
      secret: process.env.HCAPTCHA_SECRET as string,
    }),
  })
  if (resp.status !== 200) {
    throw new Error('Failed to reach hCaptcha backend')
  }
  const body = await resp.json()
  return body.success
}

/**
 * Send a verification email to the users private email.
 */
export async function submitStep1(
  email: string,
  captchaToken: string
): Promise<ActionResult<Step1Error>> {
  if (!z.email().safeParse(email).success) {
    return { ok: false, error: 'invalid_email' }
  }

  try {
    if (!(await verifyCaptcha(captchaToken))) {
      return { ok: false, error: 'captcha' }
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' })

    const userManagement = getUserManagement()
    const user = await userManagement.getUser(email)

    if (user == null) {
      return { ok: false, error: 'not_found' }
    }

    const verificationUrl = new URL(
      `/step2?token=${token}`,
      process.env.BASE_URL || 'http://localhost:3000'
    ).href

    sendEmail(
      email,
      'Verifikation des Studierendenstatus fortsetzen',
      <Step1VerificationEmail
        name={user.name}
        verificationUrl={verificationUrl}
      />
    )
    return { ok: true }
  } catch (e) {
    console.error(e)
    return { ok: false, error: 'unknown' }
  }
}
