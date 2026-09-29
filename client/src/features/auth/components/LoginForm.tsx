import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import { Link as RouterLink } from 'react-router-dom'
import { emailSchema } from '../validation'
import { EmailField } from './EmailField'
import { AuthHeading } from './AuthHeading'
import { PasswordField } from './PasswordField'
import { InfoNote } from './InfoNote'
import { authService } from '../authService'
import { errorMessage } from '../../../utils/errorMessage'
import { testIdProps } from '../../../utils/testIdProps'

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
      setAuthError(errorMessage(error, 'Unable to sign in.'))
    }
  }

  return (
    <Stack
      spacing={2.75}
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      data-testid="login-form"
    >
      <AuthHeading title="TaskFlow" subtitle="Sign in to continue" />

      {authError && (
        <Alert severity="error" data-testid="login-form-error">
          {authError}
        </Alert>
      )}

      <EmailField<LoginFormValues>
        control={control}
        testId="login-form-email"
      />

      <Stack spacing={0.75}>
        <PasswordField<LoginFormValues>
          name="password"
          control={control}
          testId="login-form-password"
        />
        <Box sx={{ textAlign: 'right' }}>
          <Link
            component={RouterLink}
            to="/forgot-password"
            data-testid="login-form-forgot-password"
            sx={{
              fontSize: 13,
              fontWeight: 600,
              display: 'inline-block',
              py: 0.5,
            }}
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
                slotProps={{ input: testIdProps('login-form-remember-me') }}
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

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        data-testid="login-form-submit"
      >
        Sign in
      </Button>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center' }}
      >
        Don't have an account?{' '}
        <Link
          component={RouterLink}
          to="/signup"
          sx={{ fontWeight: 600 }}
          data-testid="login-form-sign-up"
        >
          Sign up
        </Link>
      </Typography>

      {/* NO-BACKEND: remove this note once real accounts exist. */}
      <InfoNote>
        Note: accounts are stored in this browser. Sign up for a new account, or
        use the sample account <strong>administrator@example.com</strong> /{' '}
        <strong>123456</strong>. Real accounts will be added once a backend is
        in place.
      </InfoNote>
    </Stack>
  )
}
