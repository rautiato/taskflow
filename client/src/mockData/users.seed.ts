import type { User } from '../models/user'

export const USERS_SEED_VERSION = '1'

export const SEEDED_USERS: User[] = [
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
  {
    id: 'seed-3',
    name: 'Ha Tran',
    email: 'hatran@example.com',
    password: 'password123',
    role: 'Member',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]
