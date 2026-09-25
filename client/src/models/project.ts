export type ProjectStatus = 'Active' | 'Closed'
export type ProjectPaletteColor = 'error' | 'primary' | 'success' | 'warning'

// What's persisted.
export interface StoredProject {
  id: string
  name: string
  initials: string
  paletteColor: ProjectPaletteColor
  updatedAt: string
  status: ProjectStatus
}

// Team-wide numbers derived from the project's tasks on every read — never
// stored (PLAN.md §3's "Seed data & derived project stats" decision).
export interface ProjectStats {
  taskCount: number
  progress: number
  completedCount: number
  overdueCount: number // open tasks past their due date
  unassignedCount: number // open tasks with no assignee
}

export type Project = StoredProject & ProjectStats
