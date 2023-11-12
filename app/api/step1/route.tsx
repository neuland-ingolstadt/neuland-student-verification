import { EasyVereinUserManagement } from '@/etc/easyverein-user-management'
import jwt from 'jsonwebtoken'
import { transporter } from '@/etc/mailer'

export async function POST (request: Request) {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const secret = process.env.JWT_SECRET as string

  const token = jwt.sign({ email }, secret, { expiresIn: '1h' })

  const userManagement = new EasyVereinUserManagement()
  if (await userManagement.getUser(email) != null) {
    transporter.sendMail({
      from: 'noreply@neuland-ingolstadt.de',
      to: email,
      subject: 'Verifikation des Studierendenstatus fortsetzen',
      text: `Bitte klicke auf diesen Link, um den Verifikationsprozess fortzusetzen:\n${process.env.BASE_URL}step2?token=${token}`
    })
    return Response.json({})
  } else {
    return Response.json({ error: 'user not found' }, { status: 404 })
  }
}
