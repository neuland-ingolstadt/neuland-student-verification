'use server'

import jwt from 'jsonwebtoken'
import { EasyVereinApiError } from '@/etc/easyverein'
import { updateUser } from '@/etc/easyverein/user-management'
import type { ActionResult, Step3Error } from '@/lib/action-result'
import { JWT_SECRET } from '@/lib/utils'

interface FinishToken extends jwt.JwtPayload {
  privateEmail: string
  email: string
}

/**
 * Mark the user as verified.
 */
export async function submitStep3(
  token: string
): Promise<ActionResult<Step3Error>> {
  try {
    const { email, privateEmail } = jwt.verify(token, JWT_SECRET) as FinishToken

    await updateUser(privateEmail, email, new Date())

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
