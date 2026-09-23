import type { Project } from '../models/project'

export const PROJECTS_SEED_VERSION = '1'

export const SEEDED_PROJECTS: Project[] = [
  {
    id: 'project-1',
    name: 'Task Management App',
    initials: 'TA',
    paletteColor: 'error',
    taskCount: 18,
    updatedAt: '2026-09-19T00:00:00.000Z',
    status: 'Active',
    progress: 60,
  },
  {
    id: 'project-2',
    name: 'Mobile App',
    initials: 'MA',
    paletteColor: 'primary',
    taskCount: 32,
    updatedAt: '2026-09-18T00:00:00.000Z',
    status: 'Active',
    progress: 34,
  },
  {
    id: 'project-3',
    name: 'Internal Tools',
    initials: 'IT',
    paletteColor: 'success',
    taskCount: 11,
    updatedAt: '2026-09-12T00:00:00.000Z',
    status: 'Active',
    progress: 73,
  },
  {
    id: 'project-4',
    name: 'Marketing Campaign',
    initials: 'MC',
    paletteColor: 'warning',
    taskCount: 8,
    updatedAt: '2026-09-10T00:00:00.000Z',
    status: 'On Hold',
    progress: 20,
  },
]
