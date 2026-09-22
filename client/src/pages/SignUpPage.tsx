import { AuthLayout } from '../features/auth/components/AuthLayout'
import { SignUpForm } from '../features/auth/components/SignUpForm'

export function SignUpPage() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  )
}
