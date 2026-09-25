import type { StoredProject } from '../models/project'

export const PROJECTS_SEED_VERSION = '1'

export const SEEDED_PROJECTS: StoredProject[] = [
  {
    id: 'project-1',
    name: 'Task Management App',
    initials: 'TA',
    paletteColor: 'error',
    updatedAt: '2026-09-19T00:00:00.000Z',
    status: 'Active',
  },
  {
    id: 'project-2',
    name: 'Mobile App',
    initials: 'MA',
    paletteColor: 'primary',
    updatedAt: '2026-09-18T00:00:00.000Z',
    status: 'Active',
  },
  {
    id: 'project-3',
    name: 'Internal Tools',
    initials: 'IT',
    paletteColor: 'success',
    updatedAt: '2026-09-12T00:00:00.000Z',
    status: 'Active',
  },
  {
    id: 'project-4',
    name: 'Marketing Campaign',
    initials: 'MC',
    paletteColor: 'warning',
    updatedAt: '2026-09-10T00:00:00.000Z',
    status: 'Closed',
  },
]
