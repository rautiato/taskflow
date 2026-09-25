import type { TaskItem, TaskPriority } from '../../models/task'
import type { KanbanColumn } from '../../models/kanbanBoard'

export const PRIORITY_STYLES: Record<
  TaskPriority,
  { bgcolor: string; color: string }
> = {
  High: { bgcolor: 'error.light', color: 'error.main' },
  Medium: { bgcolor: 'warning.light', color: 'warning.main' },
  Low: { bgcolor: 'success.light', color: 'success.main' },
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
  })
}

// Whole days from today until the task's due date: negative = overdue,
// 0 = due today. Shared by the due chips and the dashboard's stats so both
// agree on what "overdue" means.
export function daysUntilDue(dueDate: string, now = new Date()): number {
  return Math.ceil(
    (new Date(dueDate).getTime() - startOfDay(now).getTime()) / 86_400_000,
  )
}

export const DUE_SOON_DAYS = 7

export function getDoneColumnIds(columns: KanbanColumn[]): Set<string> {
  return new Set(columns.filter((c) => c.isDone).map((c) => c.id))
}

export function getDueChip(task: TaskItem, isDone: boolean) {
  if (isDone) {
    return {
      label: `Completed ${formatShortDate(task.updatedAt)}`,
      sx: { bgcolor: 'success.light', color: 'success.main' },
    }
  }
  if (!task.dueDate) return null
  const diffDays = daysUntilDue(task.dueDate)
  if (diffDays < 0) {
    return {
      label: `Overdue · ${formatShortDate(task.dueDate)}`,
      sx: { bgcolor: 'error.light', color: 'error.main' },
    }
  }
  if (diffDays === 1) {
    return {
      label: 'Due Tomorrow',
      sx: { bgcolor: 'warning.light', color: 'warning.main' },
    }
  }
  return {
    label: `Due ${formatShortDate(task.dueDate)}`,
    sx: { bgcolor: '#EEF0F2', color: 'text.secondary' },
  }
}
