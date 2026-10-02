import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { authService } from '../features/auth/authService'

function renderRoutes(initialPath: string) {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<h1>Login page</h1>} />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <>
                <h1>Dashboard page</h1>
                <Link to="/projects">Projects</Link>
              </>
            }
          />
          <Route path="/projects" element={<h1>Projects page</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear()
    authService.signOut()
  })

  it('redirects to the login page when signed out', () => {
    renderRoutes('/dashboard')

    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard page')).not.toBeInTheDocument()
  })

  it('shows the page when signed in', () => {
    authService.signIn('hatran@example.com', '123456')
    renderRoutes('/dashboard')

    expect(screen.getByText('Dashboard page')).toBeInTheDocument()
  })

  it('checks the session again when moving between protected pages', async () => {
    const user = userEvent.setup()
    authService.signIn('hatran@example.com', '123456')
    renderRoutes('/dashboard')

    // Signed out elsewhere (another tab, or an expired session) while this
    // page stays open.
    authService.signOut()
    await user.click(screen.getByRole('link', { name: 'Projects' }))

    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Projects page')).not.toBeInTheDocument()
  })
})
