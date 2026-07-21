'use server'

import jwt from 'jsonwebtoken'
import { EasyVereinApiError } from '@/etc/easyverein'
import { getUser } from '@/etc/easyverein/user-management'
import type { ActionResult, Step2Error } from '@/lib/action-result'
import { JWT_SECRET } from '@/lib/utils'
import Step2VerificationEmail from '@/mail/step2'
import { sendEmail } from '@/services/azure'

const EMAIL_REGEX = /^[a-z]{3}[0-9]{4}@thi\.de$/i

interface ContinueToken extends jwt.JwtPayload {
  email: string
}

/**
 * Send a verification email to the users student email.
 */
export async function submitStep2(
  token: string,
  studentEmail: string
): Promise<ActionResult<Step2Error>> {
  try {
    const { email: privateEmail } = jwt.verify(
      token,
      JWT_SECRET
    ) as ContinueToken

    if (!EMAIL_REGEX.test(studentEmail)) {
      return { ok: false, error: 'invalid_email' }
    }

    const token2 = jwt.sign({ privateEmail, email: studentEmail }, JWT_SECRET, {
      expiresIn: '24h',
    })

    const user = await getUser(privateEmail)

    const verificationUrl = new URL(
      `/step3?token=${token2}`,
      process.env.BASE_URL || 'http://localhost:3000'
    ).href

    sendEmail(
      studentEmail,
      'Verifikation des Studierendenstatus abschließen',
      <Step2VerificationEmail
        name={user?.name ?? 'Mensch'}
        verificationUrl={verificationUrl}
      />
    )
    return { ok: true }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return { ok: false, error: 'token_expired' }
    }
    if (e instanceof jwt.JsonWebTokenError) {
      return { ok: false, error: 'token_invalid' }
    }
    console.error(e)
    if (e instanceof EasyVereinApiError) {
      return { ok: false, error: 'backend' }
    }
    return { ok: false, error: 'unknown' }
  }
}
