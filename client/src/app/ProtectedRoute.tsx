import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { authService } from '../features/auth/authService'

export function ProtectedRoute() {
  // Subscribing to the location re-runs this check on every navigation, not
  // only when the route first mounts. Otherwise a quick Back after signing out,
  // or signing out in another tab, can leave a protected page showing.
  useLocation()
  const session = authService.getSession()
  if (!session) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
