import { Navigate, Outlet } from 'react-router-dom'
import { authService } from '../features/auth/authService'

export function ProtectedRoute() {
  const session = authService.getSession()
  if (!session) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
