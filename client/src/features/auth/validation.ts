import { z } from 'zod'

export const emailSchema = z
  .email('Enter a valid email address.')
  .min(1, 'Email is required.')

export const nameSchema = z.string().min(1, 'Name is required.')

export const PASSWORD_MIN_LENGTH = 6
export const PASSWORD_HINT = `At least ${PASSWORD_MIN_LENGTH} characters.`

export const passwordSchema = z
  .string()
  .min(
    PASSWORD_MIN_LENGTH,
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
  )
