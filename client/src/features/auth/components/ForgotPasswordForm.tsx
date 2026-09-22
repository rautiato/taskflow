import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { emailSchema } from '../validation'
import { AuthHeading } from './AuthHeading'
import { BackToSignInLink } from './BackToSignInLink'
import { PhaseOneNote } from './PhaseOneNote'
import { Logo } from '../../../components/Logo'

const forgotPasswordSchema = z.object({
  email: emailSchema,
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  function onSubmit(values: ForgotPasswordFormValues) {
    // TODO: wire to authService once the mocked, seeded-user auth lands
    console.log('request reset link', values)
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
          title="Reset your password"
          subtitle="Enter the email on your account and we'll send you a link to reset your password."
        />
      </Stack>

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Email"
            type="email"
            required
            fullWidth
            placeholder="you@example.com"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Button type="submit" variant="contained" size="large" fullWidth>
        Send reset link
      </Button>

      <PhaseOneNote>
        Phase 1 note: this flow is UI-only against the mocked local session (see
        Login) — no email is actually sent until Phase 3.
      </PhaseOneNote>
    </Stack>
  )
}
