import { solveChallenge } from 'altcha-lib/v1'
import { getAltchaChallengeAction } from '@/lib/actions/altcha'

export async function verifyClient() {
  const challenge = await getAltchaChallengeAction()

  const solution = await solveChallenge(
    challenge.challenge,
    challenge.salt,
    challenge.algorithm
  ).promise

  return {
    solution,
    challenge,
  }
}
