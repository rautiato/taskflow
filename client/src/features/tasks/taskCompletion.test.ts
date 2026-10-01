import { nextCompletedAt } from './taskCompletion'

const CURRENT_COMPLETED_DATE = '2026-09-01T10:00:00.000Z'
const NOW = '2026-10-01T10:00:00.000Z'

describe('nextCompletedAt', () => {
  it('sets the completion date to now when a task moves into Done', () => {
    expect(nextCompletedAt(null, true, NOW)).toBe(NOW)
  })

  it('keeps the original completion date while the task stays in Done', () => {
    expect(nextCompletedAt(CURRENT_COMPLETED_DATE, true, NOW)).toBe(
      CURRENT_COMPLETED_DATE,
    )
  })

  it('clears the completion date when a task leaves Done', () => {
    expect(nextCompletedAt(CURRENT_COMPLETED_DATE, false, NOW)).toBeNull()
  })

  it('leaves an open task without a completion date', () => {
    expect(nextCompletedAt(null, false, NOW)).toBeNull()
  })
})
