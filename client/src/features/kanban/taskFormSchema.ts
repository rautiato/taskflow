import { z } from 'zod'
import type { TaskItem } from '../../models/task'

/** The Assignee select's value for "no one"; saved as `assigneeId: null`. */
export const UNASSIGNED = ''

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  projectId: z.string().min(1, 'Project is required.'),
  columnId: z.string().min(1, 'Status is required.'),
  assigneeId: z.string(),
  priority: z.enum(['Low', 'Medium', 'High']),
  dueDate: z.string(),
  isFavorite: z.boolean(),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>

export function toFormValues(
  task: TaskItem | undefined,
  defaultColumnId: string,
  currentProjectId: string,
): TaskFormValues {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    projectId: currentProjectId,
    columnId: task?.columnId ?? defaultColumnId,
    assigneeId: task?.assigneeId ?? UNASSIGNED,
    priority: task?.priority ?? 'Medium',
    dueDate: task?.dueDate ?? '',
    isFavorite: task?.isFavorite ?? false,
  }
}
