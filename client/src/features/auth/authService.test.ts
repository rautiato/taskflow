import { authService } from './authService'

// From the seed data (mockData/users.seed.ts).
const SEEDED_EMAIL = 'jane@example.com'
const SEEDED_PASSWORD = '123456'

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear()
    authService.signOut()
  })

  describe('signIn', () => {
    it('returns the user without the password and starts a session', () => {
      const user = authService.signIn(SEEDED_EMAIL, SEEDED_PASSWORD)

      expect(user.email).toBe(SEEDED_EMAIL)
      expect(user).not.toHaveProperty('password')
      expect(authService.getSession()?.id).toBe(user.id)
    })

    it('accepts the email in any letter case', () => {
      const user = authService.signIn('JANE@Example.com', SEEDED_PASSWORD)

      expect(user.email).toBe(SEEDED_EMAIL)
    })

    it('rejects a wrong password without starting a session', () => {
      expect(() => authService.signIn(SEEDED_EMAIL, 'wrong-password')).toThrow(
        'Incorrect email or password.',
      )
      expect(authService.getSession()).toBeNull()
    })

    it('rejects an unknown email with the same message', () => {
      expect(() =>
        authService.signIn('nobody@example.com', SEEDED_PASSWORD),
      ).toThrow('Incorrect email or password.')
    })
  })

  describe('signUp', () => {
    it('creates a Member account and signs it in', () => {
      const user = authService.signUp('New User', 'new@example.com', 'secret1')

      expect(user).toMatchObject({
        name: 'New User',
        email: 'new@example.com',
        role: 'Member',
      })
      expect(authService.getSession()?.id).toBe(user.id)
    })

    it('lets the new account sign in later', () => {
      const newUser = {
        name: 'New User',
        email: 'new@example.com',
        password: 'secret1',
      }
      authService.signUp(newUser.name, newUser.email, newUser.password)
      authService.signOut()

      expect(authService.signIn('new@example.com', 'secret1').name).toBe(
        newUser.name,
      )
    })

    it('rejects an email that already has an account, ignoring case', () => {
      authService.signUp('First User', 'taken@example.com', 'secret1')
      authService.signOut()

      expect(() =>
        authService.signUp('Second User', 'TAKEN@Example.com', 'secret2'),
      ).toThrow('An account with this email already exists.')
      expect(authService.getSession()).toBeNull()
    })
  })

  it('signOut ends the session', () => {
    authService.signIn(SEEDED_EMAIL, SEEDED_PASSWORD)

    authService.signOut()

    expect(authService.getSession()).toBeNull()
  })
})
