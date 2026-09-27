export const TASK_DND_TYPE = 'TASK'

const UNASSIGNED_KEY = 'unassigned'

/**
 * Drag-and-drop droppable id for one board cell (assignee lane × column),
 * formatted `assigneeId::columnId`. Reversed by `parseTaskCellId`.
 */
export function taskCellId(
  assigneeId: string | null,
  columnId: string,
): string {
  return `${assigneeId ?? UNASSIGNED_KEY}::${columnId}`
}

/** Inverse of `taskCellId`. */
export function parseTaskCellId(cellId: string): {
  assigneeId: string | null
  columnId: string
} {
  const [assigneeKey, columnId] = cellId.split('::')
  return {
    assigneeId: assigneeKey === UNASSIGNED_KEY ? null : assigneeKey,
    columnId,
  }
}
