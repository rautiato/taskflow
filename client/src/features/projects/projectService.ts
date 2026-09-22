import type { Project } from '../../models/project'

const PROJECTS_KEY = 'taskflow.projects'

const SEEDED_PROJECTS: Project[] = [
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

function loadProjects(): Project[] {
  const raw = localStorage.getItem(PROJECTS_KEY)
  if (!raw) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(SEEDED_PROJECTS))
    return SEEDED_PROJECTS
  }
  return JSON.parse(raw) as Project[]
}

function listProjects(): Project[] {
  return loadProjects()
}

export function formatProjectDate(iso: string, withYear = false): string {
  return new Date(iso).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    ...(withYear ? { year: 'numeric' as const } : {}),
  })
}

export const projectService = {
  listProjects,
}
