import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import { Link as RouterLink } from 'react-router-dom'
import { emailSchema } from '../validation'
import { AuthHeading } from './AuthHeading'
import { PasswordField } from './PasswordField'
import { PhaseOneNote } from './PhaseOneNote'
import { authService } from '../authService'

const signUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required.'),
    email: emailSchema,
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

type SignUpFormValues = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<string | null>(null)
  const { control, handleSubmit } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  function onSubmit(values: SignUpFormValues) {
    setAuthError(null)
    try {
      authService.signUp(values.name, values.email, values.password)
      navigate('/dashboard')
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : 'Unable to create account.',
      )
    }
  }

  return (
    <Stack
      spacing={2.75}
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <AuthHeading
        title="Create your account"
        subtitle="Start organizing your work"
      />

      {authError && <Alert severity="error">{authError}</Alert>}

      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Name"
            required
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

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

      <PasswordField<SignUpFormValues> name="password" control={control} />
      <PasswordField<SignUpFormValues>
        name="confirmPassword"
        control={control}
        label="Confirm password"
      />

      <Button type="submit" variant="contained" size="large" fullWidth>
        Sign up
      </Button>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center' }}
      >
        Already have an account?{' '}
        <Link
          component={RouterLink}
          to="/login"
          underline="hover"
          sx={{ fontWeight: 600 }}
        >
          Sign in
        </Link>
      </Typography>

      <PhaseOneNote>
        Phase 1 note: sign-up creates a local mock account (seeded users in this
        browser only) — real account creation arrives with the Phase 3 backend.
      </PhaseOneNote>
    </Stack>
  )
}
