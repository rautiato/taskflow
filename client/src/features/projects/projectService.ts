import type { Project, StoredProject } from '../../models/project'
import {
  SEEDED_PROJECTS,
  PROJECTS_SEED_VERSION,
} from '../../mockData/projects.seed'
import { loadSeededData } from '../../services/localStorageSeed'
import { writeJson } from '../../services/storage'
import { kanbanService } from '../kanban/kanbanService'

const PROJECTS_KEY = 'taskflow.projects'

function loadProjects(): StoredProject[] {
  return loadSeededData(PROJECTS_KEY, PROJECTS_SEED_VERSION, SEEDED_PROJECTS)
}

// taskCount and progress are computed from the project's tasks on every read,
// the way the real API will compute them with a query, so they're never stored.
function withStats(project: StoredProject): Project {
  const { lastTaskUpdatedAt, ...stats } = kanbanService.getProjectStats(
    project.id,
  )
  // "Updated" reflects the latest task activity too, not only project edits.
  const updatedAt =
    lastTaskUpdatedAt && lastTaskUpdatedAt > project.updatedAt
      ? lastTaskUpdatedAt
      : project.updatedAt
  return { ...project, ...stats, updatedAt }
}

function listProjects(): Project[] {
  return loadProjects().map(withStats)
}

function saveProjects(projects: StoredProject[]): void {
  writeJson(PROJECTS_KEY, projects)
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
  const project: StoredProject = {
    id: crypto.randomUUID(),
    name: input.name,
    initials: initialsFor(input.name),
    paletteColor: PALETTE_COLORS[all.length % PALETTE_COLORS.length],
    updatedAt: new Date().toISOString(),
    status: 'Active',
  }
  saveProjects([...all, project])
  return withStats(project)
}

function updateProjectStatus(id: string, status: Project['status']): Project {
  const all = loadProjects()
  let updated: StoredProject | undefined
  const next = all.map((p) => {
    if (p.id !== id) return p
    updated = { ...p, status }
    return updated
  })
  if (!updated) {
    throw new Error('Project not found.')
  }
  saveProjects(next)
  return withStats(updated)
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
