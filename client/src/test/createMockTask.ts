import type { TaskItem } from '../models/task'

export function createMockTask(overrides: Partial<TaskItem>): TaskItem {
  return {
    id: overrides.title ?? 'task',
    columnId: 'todo',
    title: 'Task',
    description: '',
    priority: 'Medium',
    dueDate: null,
    assigneeId: null,
    createdById: null,
    isFavorite: false,
    order: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    completedAt: null,
    ...overrides,
  }
}
