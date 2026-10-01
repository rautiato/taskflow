import type { Project } from '../models/project'

export function createMockProject(overrides: Partial<Project>): Project {
  return {
    id: 'project',
    name: 'Project',
    initials: 'P',
    paletteColor: 'primary',
    updatedAt: '2026-01-01T12:00:00.000Z',
    status: 'Active',
    taskCount: 0,
    progress: 0,
    completedCount: 0,
    overdueCount: 0,
    unassignedCount: 0,
    ...overrides,
  }
}
