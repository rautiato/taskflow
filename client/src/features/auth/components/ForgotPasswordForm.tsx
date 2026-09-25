import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
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
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  function onSubmit(values: ForgotPasswordFormValues) {
    setSubmittedEmail(values.email)
  }

  return (
    <Stack spacing={2.75}>
      <BackToSignInLink />

      <Stack spacing={0.75}>
        <Logo />
        <AuthHeading
          title="Reset your password"
          subtitle="Enter the email on your account and we'll send you a link to reset your password."
        />
      </Stack>

      {submittedEmail ? (
        <Alert severity="info">
          This is a demo app, so no email was actually sent to {submittedEmail}.
          In a real deployment:
          <Box component="ol" sx={{ m: 0, pl: 2.5 }}>
            <li>Verify the address</li>
            <li>Email a one-time reset link</li>
            <li>Let you set a new password after you click it</li>
          </Box>
        </Alert>
      ) : (
        <Stack
          spacing={2.75}
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
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
            Phase 1 note: this flow is UI-only against the mocked local session
            (see Login) — no email is actually sent until Phase 3.
          </PhaseOneNote>
        </Stack>
      )}
    </Stack>
  )
}
