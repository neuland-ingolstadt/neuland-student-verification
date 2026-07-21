'use server'

import jwt from 'jsonwebtoken'
import * as z from 'zod'
import { EasyVereinApiError } from '@/etc/easyverein'
import { getUserManagement } from '@/etc/user-management'
import type { ActionResult, Step1Error } from '@/lib/action-result'
import { AltchaClient } from '@/lib/altcha/server'
import { type AltchaData, altchaSchema } from '@/lib/schemas/altchaSchema'
import { JWT_SECRET } from '@/lib/utils'
import Step1VerificationEmail from '@/mail/step1'
import { sendEmail } from '@/services/azure'

/**
 * Send a verification email to the users private email.
 */
export async function submitStep1(
  email: string,
  altcha: AltchaData
): Promise<ActionResult<Step1Error>> {
  if (!z.email().safeParse(email).success) {
    return { ok: false, error: 'invalid_email' }
  }

  try {
    const parsedAltcha = altchaSchema.safeParse(altcha)
    if (
      !parsedAltcha.success ||
      !(await AltchaClient.getInstance().verifySolution(parsedAltcha.data))
    ) {
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
    if (e instanceof EasyVereinApiError) {
      return { ok: false, error: 'backend' }
    }
    return { ok: false, error: 'unknown' }
  }
}
