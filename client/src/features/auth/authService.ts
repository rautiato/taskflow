import type { UserDto, User } from '../../models/user'
import { SEEDED_USERS, USERS_SEED_VERSION } from '../../mockData/users.seed'
import { loadSeededData } from '../../services/localStorageSeed'
import { writeJson } from '../../services/storage'

const USERS_KEY = 'taskflow.users'
const SESSION_COOKIE = 'taskflow.session'
const REMEMBER_ME_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days

// Phase 1 stand-in for the HttpOnly auth cookie the Phase 3 API will set.
// "Remember me" makes it persistent (max-age); otherwise it's a session cookie
// the browser drops on close. Cookies are shared across tabs, like the real one.
function saveSession(userId: string, remember: boolean): void {
  const maxAge = remember ? `; max-age=${REMEMBER_ME_MAX_AGE_SECONDS}` : ''
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(userId)}; path=/; SameSite=Lax${maxAge}`
}

function readSession(): string | null {
  const prefix = `${SESSION_COOKIE}=`
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(prefix))
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null
}

function loadUsers(): User[] {
  return loadSeededData(USERS_KEY, USERS_SEED_VERSION, SEEDED_USERS)
}

function saveUsers(users: User[]): void {
  writeJson(USERS_KEY, users)
}

function toUserDto(user: User): UserDto {
  const { password: _password, ...userDto } = user
  void _password
  return userDto
}

function signIn(email: string, password: string, remember = false): UserDto {
  const user = loadUsers().find(
    (candidate) =>
      candidate.email.toLowerCase() === email.toLowerCase() &&
      candidate.password === password,
  )
  if (!user) {
    throw new Error('Incorrect email or password.')
  }
  saveSession(user.id, remember)
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
  saveSession(newUser.id, true)
  return toUserDto(newUser)
}

function updateProfile(
  userId: string,
  updates: { name: string; email: string },
): UserDto {
  const users = loadUsers()
  const user = users.find((candidate) => candidate.id === userId)
  if (!user) {
    throw new Error('User not found.')
  }
  const emailTaken = users.some(
    (candidate) =>
      candidate.id !== userId &&
      candidate.email.toLowerCase() === updates.email.toLowerCase(),
  )
  if (emailTaken) {
    throw new Error('An account with this email already exists.')
  }

  user.name = updates.name
  user.email = updates.email
  saveUsers(users)
  return toUserDto(user)
}

function updateAvatar(userId: string, avatarUrl: string | null): UserDto {
  const users = loadUsers()
  const user = users.find((candidate) => candidate.id === userId)
  if (!user) {
    throw new Error('User not found.')
  }
  user.avatarUrl = avatarUrl
  saveUsers(users)
  return toUserDto(user)
}

function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): void {
  const users = loadUsers()
  const user = users.find((candidate) => candidate.id === userId)
  if (!user) {
    throw new Error('User not found.')
  }
  if (user.password !== currentPassword) {
    throw new Error('Current password is incorrect.')
  }
  user.password = newPassword
  saveUsers(users)
}

function signOut(): void {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`
}

function getSession(): UserDto | null {
  const userId = readSession()
  if (!userId) {
    return null
  }
  const user = loadUsers().find((candidate) => candidate.id === userId)
  return user ? toUserDto(user) : null
}

function listUsers(): UserDto[] {
  return loadUsers().map(toUserDto)
}

export const authService = {
  signIn,
  signUp,
  signOut,
  getSession,
  listUsers,
  updateProfile,
  updateAvatar,
  changePassword,
}
