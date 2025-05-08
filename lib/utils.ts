const JWT_SECRET = process.env.JWT_SECRET as string
const FROM_EMAIL = process.env.FROM_EMAIL as string

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set')
}

if (!FROM_EMAIL) {
  throw new Error('FROM_EMAIL is not set')
}

export { JWT_SECRET, FROM_EMAIL }
