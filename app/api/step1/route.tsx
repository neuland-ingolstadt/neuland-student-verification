import { getUserManagement } from '@/etc/user-management'
import jwt from 'jsonwebtoken'
import { transporter } from '@/etc/mailer'

const JWT_SECRET = process.env.JWT_SECRET!
const FROM_EMAIL = process.env.FROM_EMAIL!

/**
 * Send a verification email to the users private email.
 */
export async function POST (request: Request) {
  const formData = await request.formData()
  const email = formData.get('email') as string

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' })

  const userManagement = getUserManagement()
  if (await userManagement.getUser(email) != null) {
    transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verifikation des Studierendenstatus fortsetzen',
      text: `Bitte klicke auf diesen Link, um den Verifikationsprozess fortzusetzen:\n${process.env.BASE_URL}step2?token=${token}`
    })
    return new Response()
  } else {
    return new Response('User not found', { status: 404 })
  }
}
