import { differenceInCalendarDays, format, parseISO } from 'date-fns'
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

/**
 * "Sep 5, 2026" in the user's time zone. Takes a calendar date ("2026-09-05",
 * like a due date) or a timestamp (like completedAt); parseISO reads a
 * calendar date as local midnight, so it never shifts to the day before.
 */
export function formatShortDate(isoDateOrTimestamp: string) {
  return format(parseISO(isoDateOrTimestamp), 'MMM d, yyyy')
}

/**
 * Whole days from today until the task's due date: negative = overdue,
 * 0 = due today. Shared by the due chips and the dashboard's stats so both
 * agree on what "overdue" means. Counts calendar days in the user's time
 * zone, so a task due today is "today" everywhere.
 */
export function daysUntilDue(dueDate: string, now = new Date()): number {
  return differenceInCalendarDays(parseISO(dueDate), now)
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
