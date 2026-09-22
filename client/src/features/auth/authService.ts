import type { UserDto, User } from '../../models/user'

const USERS_KEY = 'taskflow.users'
const SESSION_KEY = 'taskflow.session'

const SEEDED_USERS: User[] = [
  {
    id: 'seed-1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123',
    role: 'Member',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-2',
    name: 'John Smith',
    email: 'john@example.com',
    password: 'password123',
    role: 'Member',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]

function loadUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY)
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(SEEDED_USERS))
    return SEEDED_USERS
  }
  return JSON.parse(raw) as User[]
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function toUserDto(user: User): UserDto {
  const { password: _password, ...userDto } = user
  return userDto
}

function signIn(email: string, password: string): UserDto {
  const user = loadUsers().find(
    (candidate) =>
      candidate.email.toLowerCase() === email.toLowerCase() &&
      candidate.password === password,
  )
  if (!user) {
    throw new Error('Incorrect email or password.')
  }
  localStorage.setItem(SESSION_KEY, user.id)
  return toUserDto(user)
}

function signUp(name: string, email: string, password: string): UserDto {
  const users = loadUsers()
  const alreadyExists = users.some(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  )
  if (alreadyExists) {
    throw new Error('An account with this email already exists.')
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    role: 'Member',
    createdAt: new Date().toISOString(),
  }
  saveUsers([...users, newUser])
  localStorage.setItem(SESSION_KEY, newUser.id)
  return toUserDto(newUser)
}

function signOut(): void {
  localStorage.removeItem(SESSION_KEY)
}

function getSession(): UserDto | null {
  const userId = localStorage.getItem(SESSION_KEY)
  if (!userId) {
    return null
  }
  const user = loadUsers().find((candidate) => candidate.id === userId)
  return user ? toUserDto(user) : null
}

export const authService = {
  signIn,
  signUp,
  signOut,
  getSession,
}
