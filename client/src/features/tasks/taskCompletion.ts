/**
 * A task's completion date after it's saved in a column: set when it
 * enters a Done column, kept while it stays done (so editing a finished
 * task doesn't change it), and cleared when it leaves — so re-completing a
 * reopened task records the new date. Same rule as Jira, Linear, GitHub
 * and Asana.
 */
export function nextCompletedAt(
  current: string | null,
  isDone: boolean,
  now: string,
): string | null {
  return isDone ? (current ?? now) : null
}
