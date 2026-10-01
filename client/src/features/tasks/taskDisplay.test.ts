import { daysUntilDue, formatShortDate } from './taskDisplay'

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
