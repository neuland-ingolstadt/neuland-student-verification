import * as z from 'zod'

export const altchaSchema = z.object({
  challenge: z.object({
    challenge: z.string(),
    salt: z.string(),
    algorithm: z.enum(['SHA-1', 'SHA-256', 'SHA-512']),
    signature: z.string(),
  }),
  solution: z.object({
    number: z.number(),
    took: z.number(),
  }),
})

export type AltchaData = z.infer<typeof altchaSchema>
