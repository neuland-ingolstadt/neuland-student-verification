import crypto from 'node:crypto'
import { createChallenge, verifySolution } from 'altcha-lib/v1'
import type { Challenge } from 'altcha-lib/v1/types'
import type { AltchaData } from '@/lib/schemas/altchaSchema'

const ALTCHA_SECRET = process.env.ALTCHA_SECRET as string

let altchaClientInstance: AltchaClient | null = null

export class AltchaClient {
  private hmacKey: string

  constructor() {
    this.hmacKey = this.generateHmacKey()
  }

  generateHmacKey() {
    const hmac = crypto.createHmac('sha256', ALTCHA_SECRET)
    return hmac.digest('hex')
  }

  async createChallenge(): Promise<Challenge> {
    const { challenge, salt, algorithm, signature } = await createChallenge({
      hmacKey: this.hmacKey,
      algorithm: 'SHA-256',
      maxNumber: 75_000,
      saltLength: 20,
    })

    return { challenge, salt, algorithm, signature }
  }

  async verifySolution(altcha: AltchaData): Promise<boolean> {
    return verifySolution(
      {
        algorithm: altcha.challenge.algorithm,
        challenge: altcha.challenge.challenge,
        salt: altcha.challenge.salt,
        signature: altcha.challenge.signature,
        number: altcha.solution.number,
      },
      this.hmacKey
    )
  }

  public static getInstance(): AltchaClient {
    if (!altchaClientInstance) {
      altchaClientInstance = new AltchaClient()
    }
    return altchaClientInstance
  }
}
