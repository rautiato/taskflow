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
