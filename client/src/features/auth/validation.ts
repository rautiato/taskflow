import { z } from 'zod'

export const emailSchema = z
  .email('Enter a valid email address.')
  .min(1, 'Email is required.')

export const nameSchema = z.string().min(1, 'Name is required.')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
