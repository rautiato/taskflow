import { AuthLayout } from '../features/auth/components/AuthLayout'
import { ResetPasswordForm } from '../features/auth/components/ResetPasswordForm'

export function ResetPasswordPage() {
  return (
    <AuthLayout brandPanel={false}>
      <ResetPasswordForm />
    </AuthLayout>
  )
}
