import { useEffect, useRef } from 'react'
import {
  useWatch,
  type Control,
  type UseFormGetValues,
  type UseFormSetValue,
} from 'react-hook-form'
import type { KanbanColumn } from '../../models/kanbanBoard'
import { useProjectColumns } from './useProjectColumns'
import type { TaskFormValues } from './taskFormSchema'

/**
 * Returns the Status options for the task form's selected project, and keeps
 * the selected Status valid when the project changes. A same-named column in
 * the new project (e.g. "In Progress" -> "In Progress") is preferred over the
 * first column, so switching projects doesn't quietly change the status.
 */
export function useStatusColumns({
  control,
  getValues,
  setValue,
  columns,
  currentProjectId,
}: {
  control: Control<TaskFormValues>
  getValues: UseFormGetValues<TaskFormValues>
  setValue: UseFormSetValue<TaskFormValues>
  // The current project's columns, already loaded by the page.
  columns: KanbanColumn[]
  currentProjectId: string
}): KanbanColumn[] {
  const selectedProjectId = useWatch({ control, name: 'projectId' })
  const isDifferentProject = selectedProjectId !== currentProjectId
  const { columns: otherProjectColumns } = useProjectColumns(
    isDifferentProject ? selectedProjectId : '',
  )
  const availableColumns = isDifferentProject ? otherProjectColumns : columns
  const previousColumnsRef = useRef(availableColumns)

  // Runs on every change of project, including the initial load, where
  // columns can arrive asynchronously.
  useEffect(() => {
    // While the destination project's columns are still loading,
    // availableColumns is transiently empty — skip entirely rather than
    // overwriting previousColumnsRef with that empty list, which would
    // erase the outgoing column's name before we ever get to look it up.
    if (availableColumns.length === 0) return

    const currentColumnId = getValues('columnId')
    const stillValid = availableColumns.some((c) => c.id === currentColumnId)
    if (!stillValid) {
      const previousColumn = previousColumnsRef.current.find(
        (c) => c.id === currentColumnId,
      )
      const sameNameColumn = previousColumn
        ? availableColumns.find((c) => c.name === previousColumn.name)
        : undefined
      setValue('columnId', (sameNameColumn ?? availableColumns[0]).id)
    }
    previousColumnsRef.current = availableColumns
  }, [availableColumns, getValues, setValue])

  return availableColumns
}
