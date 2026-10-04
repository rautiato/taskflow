import { render, screen } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { LoginForm } from './LoginForm'
import { authService } from '../authService'

function renderLoginForm() {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<h1>Dashboard page</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

async function signIn(user: UserEvent, email: string, password: string) {
  await user.type(screen.getByTestId('login-form-email'), email)
  await user.type(screen.getByTestId('login-form-password'), password)
  await user.click(screen.getByTestId('login-form-submit'))
}

describe('LoginForm', () => {
  beforeEach(() => {
    localStorage.clear()
    authService.signOut()
  })

  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.click(screen.getByTestId('login-form-submit'))

    expect(
      await screen.findByText('Enter a valid email address.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Password is required.')).toBeInTheDocument()
  })

  it('rejects an invalid email address', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await signIn(user, 'not-a-valid-email', '123456')

    expect(
      await screen.findByText('Enter a valid email address.'),
    ).toBeInTheDocument()
    expect(authService.getSession()).toBeNull()
  })

  it('shows an error and stays on the page when the password is wrong', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await signIn(user, 'administrator@example.com', 'wrong-password')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Incorrect email or password.',
    )
    expect(screen.queryByText('Dashboard page')).not.toBeInTheDocument()
    expect(authService.getSession()).toBeNull()
  })

  it('signs in and goes to the dashboard with valid credentials', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await signIn(user, 'administrator@example.com', '123456')

    expect(await screen.findByText('Dashboard page')).toBeInTheDocument()
    expect(authService.getSession()?.email).toBe('administrator@example.com')
  })

  it('signs in with the demo account without filling in the form', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.click(screen.getByTestId('login-form-demo'))

    expect(await screen.findByText('Dashboard page')).toBeInTheDocument()
    expect(authService.getSession()?.email).toBe('administrator@example.com')
  })

  it('accepts the email in any letter case', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await signIn(user, 'Administrator@Example.com', '123456')

    expect(await screen.findByText('Dashboard page')).toBeInTheDocument()
  })
})
