import { z } from 'zod'

export const emailSchema = z
  .email('Enter a valid email address.')
  .min(1, 'Email is required.')
