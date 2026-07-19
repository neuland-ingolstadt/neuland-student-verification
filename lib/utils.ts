import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const JWT_SECRET = process.env.JWT_SECRET || ''
export const FROM_EMAIL = process.env.FROM_EMAIL || ''
