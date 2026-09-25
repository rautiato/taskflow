import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { AuthHeading } from './AuthHeading'
import { BackToSignInLink } from './BackToSignInLink'
import { PasswordField } from './PasswordField'
import { PhaseOneNote } from './PhaseOneNote'
import { Logo } from '../../../components/Logo'
import { passwordSchema } from '../validation'

const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm() {
  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  function onSubmit(values: ResetPasswordFormValues) {
    // TODO: wire to authService once real reset tokens exist (Phase 3)
    console.log('reset password', values)
  }

  return (
    <Stack
      spacing={2.75}
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <BackToSignInLink />

      <Stack spacing={0.75}>
        <Logo />
        <AuthHeading
          title="Set a new password"
          subtitle="Choose a new password for your account."
        />
      </Stack>

      <PasswordField<ResetPasswordFormValues>
        name="newPassword"
        control={control}
        label="New password"
      />
      <PasswordField<ResetPasswordFormValues>
        name="confirmPassword"
        control={control}
        label="Confirm password"
      />

      <Button type="submit" variant="contained" size="large" fullWidth>
        Reset password
      </Button>

      <PhaseOneNote>
        Phase 1 note: this page is UI-only — there's no real reset token to
        verify until Phase 3, so Forgot Password doesn't yet link here
        automatically.
      </PhaseOneNote>
    </Stack>
  )
}
