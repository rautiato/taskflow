import { createMockTask } from '../../test/createMockTask'
import { daysUntilDue, formatShortDate, getDueChip } from './taskDisplay'

describe('daysUntilDue', () => {
  // Local times, so these hold in every time zone.
  const EARLY_MORNING = new Date(2026, 5, 15, 0, 30)
  const LATE_EVENING = new Date(2026, 5, 15, 23, 30)

  it.each([
    ['just after midnight', EARLY_MORNING],
    ['late in the evening', LATE_EVENING],
  ])('counts calendar days, %s', (_label, now) => {
    expect(daysUntilDue('2026-06-14', now)).toBe(-1)
    expect(daysUntilDue('2026-06-15', now)).toBe(0)
    expect(daysUntilDue('2026-06-16', now)).toBe(1)
    expect(daysUntilDue('2026-06-22', now)).toBe(7)
  })

  it('counts across a month boundary', () => {
    expect(daysUntilDue('2026-07-01', LATE_EVENING)).toBe(16)
  })
})

describe('formatShortDate', () => {
  it('shows a due date as the same calendar day', () => {
    expect(formatShortDate('2026-06-15')).toBe('Jun 15, 2026')
  })

  it('shows a timestamp in local time', () => {
    const localEvening = new Date(2026, 5, 14, 21, 0).toISOString()

    expect(formatShortDate(localEvening)).toBe('Jun 14, 2026')
  })
})

describe('getDueChip', () => {
  // getDueChip reads the real clock, so freeze it at noon on 15 June 2026.
  beforeEach(() => {
    jest.useFakeTimers({ now: new Date(2026, 5, 15, 12) })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('shows nothing for an open task without a due date', () => {
    expect(getDueChip(createMockTask({ dueDate: null }), false)).toBeNull()
  })

  it('marks a past due date as overdue', () => {
    const chip = getDueChip(createMockTask({ dueDate: '2026-06-14' }), false)

    expect(chip?.label).toBe('Overdue · Jun 14, 2026')
    expect(chip?.sx.color).toBe('error.main')
  })

  it('says "Due Tomorrow" for tomorrow', () => {
    const chip = getDueChip(createMockTask({ dueDate: '2026-06-16' }), false)

    expect(chip?.label).toBe('Due Tomorrow')
  })

  it.each([
    ['today', '2026-06-15', 'Due Jun 15, 2026'],
    ['later', '2026-06-22', 'Due Jun 22, 2026'],
  ])('shows the date for a task due %s', (_label, dueDate, expected) => {
    expect(getDueChip(createMockTask({ dueDate }), false)?.label).toBe(expected)
  })

  it('shows the completion date for a done task, even if it was overdue', () => {
    const completedAt = new Date(2026, 5, 14, 21).toISOString()
    const task = createMockTask({ dueDate: '2026-06-01', completedAt })

    const chip = getDueChip(task, true)

    expect(chip?.label).toBe('Completed Jun 14, 2026')
    expect(chip?.sx.color).toBe('success.main')
  })

  it('falls back to the last update for a done task without a completion date', () => {
    const updatedAt = new Date(2026, 5, 10, 9).toISOString()
    const task = createMockTask({ completedAt: null, updatedAt })

    expect(getDueChip(task, true)?.label).toBe('Completed Jun 10, 2026')
  })
})
