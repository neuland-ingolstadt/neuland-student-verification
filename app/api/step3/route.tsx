import { getUserManagement } from "@/etc/users"
import jwt from 'jsonwebtoken'

interface FinishToken extends jwt.JwtPayload {
    privateEmail: string
    email: string
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const token = formData.get('token') as string

  const secret = process.env.JWT_SECRET as string

  const { email, privateEmail } = jwt.verify(token, secret) as FinishToken

  const userManagement = getUserManagement()

  await userManagement.updateUser(privateEmail, email, new Date())

  return Response.json({ 'ok': true })
}
  