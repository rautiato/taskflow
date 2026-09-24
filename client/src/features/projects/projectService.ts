import type { Project } from '../../models/project'
import {
  SEEDED_PROJECTS,
  PROJECTS_SEED_VERSION,
} from '../../mockData/projects.seed'
import { loadSeededData } from '../../services/localStorageSeed'

const PROJECTS_KEY = 'taskflow.projects'

function loadProjects(): Project[] {
  return loadSeededData(PROJECTS_KEY, PROJECTS_SEED_VERSION, SEEDED_PROJECTS)
}

function listProjects(): Project[] {
  return loadProjects()
}

function saveProjects(projects: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}

// Cycles through the same four theme colors the seed data uses, so a
// new project's badge stays visually consistent with the seeded ones.
const PALETTE_COLORS: Project['paletteColor'][] = [
  'primary',
  'success',
  'warning',
  'error',
]

function initialsFor(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

type ProjectInput = { name: string }

function createProject(input: ProjectInput): Project {
  const all = loadProjects()
  const project: Project = {
    id: crypto.randomUUID(),
    name: input.name,
    initials: initialsFor(input.name),
    paletteColor: PALETTE_COLORS[all.length % PALETTE_COLORS.length],
    taskCount: 0,
    updatedAt: new Date().toISOString(),
    status: 'Active',
    progress: 0,
  }
  saveProjects([...all, project])
  return project
}

function updateProjectStatus(id: string, status: Project['status']): Project {
  const all = loadProjects()
  let updated: Project | undefined
  const next = all.map((p) => {
    if (p.id !== id) return p
    updated = { ...p, status }
    return updated
  })
  if (!updated) {
    throw new Error('Project not found.')
  }
  saveProjects(next)
  return updated
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
  createProject,
  updateProjectStatus,
}
