import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import { passwordSchema } from '../validation'
import { PasswordField } from './PasswordField'
import { authService } from '../authService'

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

export function ChangePasswordForm({ userId }: { userId: string }) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { control, handleSubmit, reset } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  function onSubmit(values: ChangePasswordFormValues) {
    setError(null)
    setSuccess(false)
    try {
      authService.changePassword(
        userId,
        values.currentPassword,
        values.newPassword,
      )
      setSuccess(true)
      reset()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to update password.',
      )
    }
  }

  return (
    <Stack
      spacing={2.5}
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Password updated.</Alert>}

      <PasswordField<ChangePasswordFormValues>
        name="currentPassword"
        control={control}
        label="Current password"
      />
      <PasswordField<ChangePasswordFormValues>
        name="newPassword"
        control={control}
        label="New password"
      />
      <PasswordField<ChangePasswordFormValues>
        name="confirmPassword"
        control={control}
        label="Confirm new password"
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained">
          Update password
        </Button>
      </Box>
    </Stack>
  )
}
