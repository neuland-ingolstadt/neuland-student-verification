'use server'

import { AltchaClient } from '@/lib/altcha/server'

export async function getAltchaChallengeAction() {
  const challenge = await AltchaClient.getInstance().createChallenge()
  return challenge
}
