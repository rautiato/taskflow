import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

async function signIn(email: string, password: string) {
  const user = userEvent.setup()
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
    renderLoginForm()

    await userEvent.click(screen.getByTestId('login-form-submit'))

    expect(
      await screen.findByText('Enter a valid email address.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Password is required.')).toBeInTheDocument()
  })

  it('rejects an invalid email address', async () => {
    renderLoginForm()

    await signIn('not-a-valid-email', '123456')

    expect(
      await screen.findByText('Enter a valid email address.'),
    ).toBeInTheDocument()
    expect(authService.getSession()).toBeNull()
  })

  it('shows an error and stays on the page when the password is wrong', async () => {
    renderLoginForm()

    await signIn('administrator@example.com', 'wrong-password')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Incorrect email or password.',
    )
    expect(screen.queryByText('Dashboard page')).not.toBeInTheDocument()
    expect(authService.getSession()).toBeNull()
  })

  it('signs in and goes to the dashboard with valid credentials', async () => {
    renderLoginForm()

    await signIn('administrator@example.com', '123456')

    expect(await screen.findByText('Dashboard page')).toBeInTheDocument()
    expect(authService.getSession()?.email).toBe('administrator@example.com')
  })

  it('accepts the email in any letter case', async () => {
    renderLoginForm()

    await signIn('Administrator@Example.com', '123456')

    expect(await screen.findByText('Dashboard page')).toBeInTheDocument()
  })
})
