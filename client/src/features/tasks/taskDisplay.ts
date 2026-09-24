import type { TaskItem, TaskPriority } from '../../models/task'

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

export function getDueChip(task: TaskItem, isDone: boolean) {
  if (isDone) {
    return {
      label: `Completed ${formatShortDate(task.updatedAt)}`,
      sx: { bgcolor: 'success.light', color: 'success.main' },
    }
  }
  if (!task.dueDate) return null
  const diffDays = Math.ceil(
    (new Date(task.dueDate).getTime() - startOfDay(new Date()).getTime()) /
      86_400_000,
  )
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
