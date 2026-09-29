import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import type { SxProps, Theme } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  PASSWORD_HINT,
} from '../validation'
import { EmailField } from './EmailField'
import { AuthHeading } from './AuthHeading'
import { PasswordField } from './PasswordField'
import { InfoNote } from './InfoNote'
import { authService } from '../authService'
import { errorMessage } from '../../../utils/errorMessage'
import { FormTextField } from '../../../components/FormTextField'

const signUpSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

type SignUpFormValues = z.infer<typeof signUpSchema>

const styles = {
  footer: {
    textAlign: 'center',
  },
  footerLink: {
    fontWeight: 600,
  },
} satisfies Record<string, SxProps<Theme>>

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
      setAuthError(errorMessage(error, 'Unable to create account.'))
    }
  }

  return (
    <Stack
      spacing={2.75}
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      data-testid="sign-up-form"
    >
      <AuthHeading
        title="Create your account"
        subtitle="Start organizing your work"
      />

      {authError && (
        <Alert severity="error" data-testid="sign-up-form-error">
          {authError}
        </Alert>
      )}

      <FormTextField<SignUpFormValues>
        name="name"
        control={control}
        label="Name"
        required
        fullWidth
        testId="sign-up-form-name"
      />

      <EmailField<SignUpFormValues>
        control={control}
        testId="sign-up-form-email"
      />

      <PasswordField<SignUpFormValues>
        name="password"
        control={control}
        hint={PASSWORD_HINT}
        testId="sign-up-form-password"
      />
      <PasswordField<SignUpFormValues>
        name="confirmPassword"
        control={control}
        label="Confirm password"
        testId="sign-up-form-confirm-password"
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        data-testid="sign-up-form-submit"
      >
        Sign up
      </Button>

      <Typography variant="body2" color="text.secondary" sx={styles.footer}>
        Already have an account?{' '}
        <Link
          component={RouterLink}
          to="/login"
          sx={styles.footerLink}
          data-testid="sign-up-form-sign-in"
        >
          Sign in
        </Link>
      </Typography>

      {/* NO-BACKEND: remove this note once real accounts exist. */}
      <InfoNote>
        Note: your account is saved only in this browser. Real account creation
        will be added once a backend is in place.
      </InfoNote>
    </Stack>
  )
}
