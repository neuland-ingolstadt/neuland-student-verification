import { getUserManagement } from '@/etc/user-management'
import { JWT_SECRET } from '@/lib/utils'
import Step2VerificationEmail from '@/mail/step2'
import { sendEmail } from '@/services/azure'
import { escape as escapeHtml } from 'html-escaper'
import jwt from 'jsonwebtoken'

const EMAIL_REGEX = /^[a-z]{3}[0-9]{4}@thi\.de$/i

interface ContinueToken extends jwt.JwtPayload {
  privateEmail: string
}

/**
 * Send a verification email to the users student email.
 */
export async function POST(request: Request) {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const token = formData.get('token') as string

  try {
    const { email: privateEmail } = jwt.verify(
      token,
      JWT_SECRET
    ) as ContinueToken

    if (EMAIL_REGEX.test(email)) {
      const token2 = jwt.sign({ privateEmail, email }, JWT_SECRET, {
        expiresIn: '24h',
      })

      const userManagement = getUserManagement()
      const user = await userManagement.getUser(privateEmail)

      const name = escapeHtml(user?.name ?? 'Mensch')
      const verificationUrl = new URL(
        `/step3?token=${token2}`,
        process.env.BASE_URL || 'http://localhost:3000'
      ).href

      sendEmail(
        email,
        'Verifikation des Studierendenstatus abschließen',
        <Step2VerificationEmail name={name} verificationUrl={verificationUrl} />
      )

      return new Response()
    }
    return new Response('Invalid email', { status: 400 })
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return new Response('Token expired', { status: 410 })
    }
    if (e instanceof jwt.JsonWebTokenError) {
      return new Response(e.message, { status: 403 })
    }
    console.error(e)
    return new Response('Unknown error', { status: 500 })
  }
}
