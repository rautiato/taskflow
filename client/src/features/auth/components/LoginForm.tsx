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
import Divider from '@mui/material/Divider'
import type { SxProps, Theme } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import { emailSchema } from '../validation'
import { EmailField } from './EmailField'
import { AuthHeading } from './AuthHeading'
import { PasswordField } from './PasswordField'
import { InfoNote } from './InfoNote'
import { authService } from '../authService'
import { errorMessage } from '../../../utils/errorMessage'
import { testIdProps } from '../../../utils/testIdProps'

// NO-BACKEND: replace with a server-provisioned demo account once a backend exists.
const DEMO_ACCOUNT = {
  email: 'administrator@example.com',
  password: '123456',
}

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.'),
  rememberMe: z.boolean(),
})

type LoginFormValues = z.infer<typeof loginSchema>

const styles = {
  forgotRow: {
    textAlign: 'right',
  },
  forgotLink: {
    fontSize: 13,
    fontWeight: 600,
    display: 'inline-block',
    py: 0.5,
  },
  footer: {
    textAlign: 'center',
  },
  footerLink: {
    fontWeight: 600,
  },
} satisfies Record<string, SxProps<Theme>>

export function LoginForm() {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<string | null>(null)
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  function signInAndGo(email: string, password: string, rememberMe: boolean) {
    setAuthError(null)
    try {
      authService.signIn(email, password, rememberMe)
      navigate('/dashboard')
    } catch (error) {
      setAuthError(errorMessage(error, 'Unable to sign in.'))
    }
  }

  function onSubmit(values: LoginFormValues) {
    signInAndGo(values.email, values.password, values.rememberMe)
  }

  function onDemoSignIn() {
    signInAndGo(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password, false)
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
        <Box sx={styles.forgotRow}>
          <Link
            component={RouterLink}
            to="/forgot-password"
            data-testid="login-form-forgot-password"
            sx={styles.forgotLink}
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

      <Divider>
        <Typography variant="caption" color="text.secondary">
          or
        </Typography>
      </Divider>

      <Button
        type="button"
        variant="outlined"
        size="large"
        fullWidth
        onClick={onDemoSignIn}
        data-testid="login-form-demo"
      >
        Continue as demo user
      </Button>

      <Typography variant="body2" color="text.secondary" sx={styles.footer}>
        Don't have an account?{' '}
        <Link
          component={RouterLink}
          to="/signup"
          sx={styles.footerLink}
          data-testid="login-form-sign-up"
        >
          Sign up
        </Link>
      </Typography>

      {/* NO-BACKEND: remove this note once real accounts exist. */}
      <InfoNote>
        Note: accounts are stored in this browser. Sign up for a new account, or
        click <strong>Continue as demo user</strong> (
        <strong>administrator@example.com</strong> / <strong>123456</strong>).
        Real accounts will be added once a backend is in place.
      </InfoNote>
    </Stack>
  )
}
