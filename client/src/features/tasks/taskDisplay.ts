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

/**
 * Whole days from today until the task's due date: negative = overdue,
 * 0 = due today. Shared by the due chips and the dashboard's stats so both
 * agree on what "overdue" means.
 */
export function daysUntilDue(dueDate: string, now = new Date()): number {
  // getTime() is in ms; divide by ms per day (24 h × 60 min × 60 s × 1000 ms).
  return Math.ceil(
    (new Date(dueDate).getTime() - startOfDay(now).getTime()) /
      (24 * 60 * 60 * 1000),
  )
}

export const DUE_SOON_DAYS = 7

export function getDoneColumnIds(columns: KanbanColumn[]): Set<string> {
  return new Set(columns.filter((c) => c.isDone).map((c) => c.id))
}

/**
 * Label and colours for a task's due-date chip, or `null` when an open
 * task has no due date. Done tasks show when they were completed.
 */
export function getDueChip(task: TaskItem, isDone: boolean) {
  if (isDone) {
    return {
      // completedAt is always set for a task in Done; updatedAt only covers
      // the moment a card was just moved between boards and hasn't
      // refreshed yet.
      label: `Completed ${formatShortDate(task.completedAt ?? task.updatedAt)}`,
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
