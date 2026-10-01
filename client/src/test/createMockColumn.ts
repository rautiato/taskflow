import type { KanbanColumn } from '../models/kanbanBoard'

export function createMockColumn(
  overrides: Partial<KanbanColumn>,
): KanbanColumn {
  return {
    id: 'todo',
    boardId: 'board',
    name: 'To Do',
    order: 0,
    isVisible: true,
    isDone: false,
    ...overrides,
  }
}
