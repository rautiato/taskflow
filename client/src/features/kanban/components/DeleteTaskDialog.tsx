import { ConfirmDialog } from '../../../components/ConfirmDialog'
import type { TaskItem } from '../../../models/task'

export function DeleteTaskDialog({
  task,
  onConfirm,
  onCancel,
}: {
  task: TaskItem | null
  onConfirm: (task: TaskItem) => void
  onCancel: () => void
}) {
  if (!task) return null
  return (
    <ConfirmDialog
      open
      title="Delete this task?"
      description={`This action can't be undone. "${task.title}" will be permanently removed.`}
      confirmLabel="Delete"
      destructive
      onConfirm={() => onConfirm(task)}
      onCancel={onCancel}
    />
  )
}
