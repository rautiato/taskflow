import { AuthLayout } from '../features/auth/components/AuthLayout'
import { ForgotPasswordForm } from '../features/auth/components/ForgotPasswordForm'

export function ForgotPasswordPage() {
  return (
    <AuthLayout brandPanel={false}>
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
