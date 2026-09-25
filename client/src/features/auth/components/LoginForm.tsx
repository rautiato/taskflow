import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import { Link as RouterLink } from 'react-router-dom'
import { emailSchema } from '../validation'
import { AuthHeading } from './AuthHeading'
import { PasswordField } from './PasswordField'
import { PhaseOneNote } from './PhaseOneNote'
import { authService } from '../authService'

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.'),
  rememberMe: z.boolean(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<string | null>(null)
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  function onSubmit(values: LoginFormValues) {
    setAuthError(null)
    try {
      authService.signIn(values.email, values.password, values.rememberMe)
      navigate('/dashboard')
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : 'Unable to sign in.',
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
      <AuthHeading title="TaskFlow" subtitle="Sign in to continue" />

      {authError && <Alert severity="error">{authError}</Alert>}

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

      <Stack spacing={0.75}>
        <PasswordField<LoginFormValues> name="password" control={control} />
        <Box sx={{ textAlign: 'right' }}>
          <Link
            component={RouterLink}
            to="/forgot-password"
            underline="hover"
            sx={{ fontSize: 12, fontWeight: 600 }}
          >
            Forgot password?
          </Link>
        </Box>
      </Stack>

      <Controller
        name="rememberMe"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                Remember me
              </Typography>
            }
          />
        )}
      />

      <Button type="submit" variant="contained" size="large" fullWidth>
        Sign in
      </Button>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center' }}
      >
        Don&apos;t have an account?{' '}
        <Link
          component={RouterLink}
          to="/signup"
          underline="hover"
          sx={{ fontWeight: 600 }}
        >
          Sign up
        </Link>
      </Typography>

      <PhaseOneNote>
        Phase 1 note: sign-in is a local mock (seeded users in this browser
        only) — real authenticated accounts arrive with the Phase 3 backend.
      </PhaseOneNote>
    </Stack>
  )
}
