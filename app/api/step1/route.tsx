import { getUserManagement } from '@/etc/user-management'
import { JWT_SECRET } from '@/lib/utils'
import Step1VerificationEmail from '@/mail/step1'
import { sendEmail } from '@/services/azure'
import { escape as escapeHtml } from 'html-escaper'
import jwt from 'jsonwebtoken'

async function verifyCaptcha(hCaptchaResponse: string): Promise<boolean> {
  if (process.env.NEXT_PUBLIC_IGNORE_HCAPTCHA) {
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
export async function POST(request: Request) {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const hCaptchaResponse = formData.get('h-captcha-response') as string

  try {
    if (!(await verifyCaptcha(hCaptchaResponse))) {
      return new Response('Failed to verify captcha', { status: 400 })
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' })

    const userManagement = getUserManagement()
    const user = await userManagement.getUser(email)

    const verificationUrl = new URL(
      `/step2?token=${token}`,
      process.env.BASE_URL || 'http://localhost:3000'
    ).href

    if (user != null) {
      const name = escapeHtml(user.name)

      sendEmail(
        email,
        'Verifikation des Studierendenstatus fortsetzen',
        <Step1VerificationEmail name={name} verificationUrl={verificationUrl} />
      )
      return new Response()
    }

    return new Response('User not found', { status: 404 })
  } catch (e) {
    console.error(e)
    return new Response('Unknown error', { status: 500 })
  }
}
