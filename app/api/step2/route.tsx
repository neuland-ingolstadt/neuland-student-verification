import { escape } from 'html-escaper'
import { getUserManagement } from '@/etc/user-management'
import jwt from 'jsonwebtoken'
import { transporter } from '@/etc/mailer'

const JWT_SECRET = process.env.JWT_SECRET!
const FROM_EMAIL = process.env.FROM_EMAIL!
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

  try {
    const { email: privateEmail } = jwt.verify(token, JWT_SECRET) as ContinueToken

    if (EMAIL_REGEX.test(email)) {
      const token2 = jwt.sign({ privateEmail, email }, JWT_SECRET, { expiresIn: '1h' })

      const userManagement = getUserManagement()
      const user = await userManagement.getUser(privateEmail)

      transporter.sendMail({
        from: FROM_EMAIL,
        to: email,
        subject: 'Verfikation des Studierendenstatus abschließen',
        html: `
          <html>
            <head>
              <title></title>
            </head>
            <body>
              <div>
                <p>
                  Hallo ${escape(user?.name ?? 'Mensch')},
                </p>
                <p>
                  danke! Deine THI-E-Mail ist hiermit verifiziert.
                </p>
                <p>
                  Bitte fahre hier fort, um die Verifikation abzuschließen: <a href="${process.env.BASE_URL}/step3?token=${token2}">Verifikation abschließen</a>
                </p>
                <p>
                  Liebe Grüße,<br>
                  dein Neuland-Team
                </p>
              </div>
            </body>
          </html>
        `
      })

      return new Response()
    } else {
      return new Response('Invalid email', { status: 400 })
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return new Response('Token expired', { status: 410 })
    } else if (e instanceof jwt.JsonWebTokenError) {
      return new Response(e.message, { status: 400 })
    } else {
      console.error(e)
      return new Response('Unknown error', { status: 500 })
    }
  }
}
