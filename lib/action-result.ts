export type ActionResult<TError extends string> =
  | { ok: true }
  | { ok: false; error: TError }

export type Step1Error = 'captcha' | 'invalid_email' | 'not_found' | 'unknown'

export type Step2Error =
  | 'invalid_email'
  | 'token_expired'
  | 'token_invalid'
  | 'unknown'

export type Step3Error = 'token_expired' | 'token_invalid' | 'unknown'
