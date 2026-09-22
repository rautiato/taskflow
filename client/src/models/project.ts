export type ProjectStatus = 'Active' | 'On Hold'
export type ProjectPaletteColor = 'error' | 'primary' | 'success' | 'warning'

export interface Project {
  id: string
  name: string
  initials: string
  paletteColor: ProjectPaletteColor
  taskCount: number
  updatedAt: string
  status: ProjectStatus
  progress: number
}
