import { getUserManagement } from '@/etc/user-management'
import jwt from 'jsonwebtoken'

interface FinishToken extends jwt.JwtPayload {
    privateEmail: string
    email: string
}

const JWT_SECRET = process.env.JWT_SECRET!

/**
 * Mark the user as verified.
 */
export async function POST (request: Request) {
  const formData = await request.formData()
  const token = formData.get('token') as string

  try {
    const { email, privateEmail } = jwt.verify(token, JWT_SECRET) as FinishToken

    const userManagement = getUserManagement()

    await userManagement.updateUser(privateEmail, email, new Date())

    return new Response()
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return new Response('Token expired', { status: 410 })
    } else {
      throw e
    }
  }
}
