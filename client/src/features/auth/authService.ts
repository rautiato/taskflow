import type { UserDto, User } from '../../models/user'
import { SEEDED_USERS, USERS_SEED_VERSION } from '../../mockData/users.seed'
import { loadSeededData } from '../../services/localStorageSeed'

const USERS_KEY = 'taskflow.users'
const SESSION_KEY = 'taskflow.session'

function loadUsers(): User[] {
  return loadSeededData(USERS_KEY, USERS_SEED_VERSION, SEEDED_USERS)
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function toUserDto(user: User): UserDto {
  const { password: _password, ...userDto } = user
  void _password
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
