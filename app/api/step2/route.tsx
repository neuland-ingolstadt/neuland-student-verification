import jwt from 'jsonwebtoken'
import { transporter } from '@/etc/mailer'

const EMAIL_REGEX = /^[a-z]{3}[0-9]{4}@thi\.de$/i

interface ContinueToken extends jwt.JwtPayload {
    privateEmail: string
}

/**
 * Send a verification email to the users student email.
 */
export async function POST (request: Request) {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const token = formData.get('token') as string

  const secret = process.env.JWT_SECRET as string

  const { email: privateEmail } = jwt.verify(token, secret) as ContinueToken

  if (EMAIL_REGEX.test(email)) {
    const token2 = jwt.sign({ privateEmail, email }, secret, { expiresIn: '1h' })

    transporter.sendMail({
      from: 'noreply@neuland-ingolstadt.de',
      to: email,
      subject: 'Verfikation des Studierendenstatus abschließen',
      text: `Bitte klicke auf diesen Link, um die Verifikation abzuschließen:\n${process.env.BASE_URL}step3?token=${token2}`
    })

    return Response.json({})
  } else {
    return Response.json({ error: 'invalid email' }, { status: 400 })
  }
}
