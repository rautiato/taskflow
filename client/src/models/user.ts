export interface User {
  id: string
  name: string
  email: string
  password: string // Phase 1 mock only — plaintext in localStorage, never a real credential store
  role: 'Member'
  avatarUrl?: string | null
  createdAt: string
}

export type UserDto = Omit<User, 'password'>
