import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import { testIdProps } from '../../../utils/testIdProps'

export function MultiSelectFilter<T extends string>({
  label,
  value,
  options,
  onChange,
  width = 140,
  testId,
}: {
  label: string
  value: T[]
  // `menuLabel` replaces `label` in the open list only, for extra detail
  // that would crowd the closed box (e.g. "Mobile App (Closed)").
  options: { value: T; label: string; menuLabel?: string }[]
  onChange: (next: T[]) => void
  width?: number
  testId: string
}) {
  const labelOf = (v: T) => options.find((o) => o.value === v)?.label ?? v
  // Full selection on hover, for labels the fixed width cuts off.
  const fullSelection = value.map(labelOf).join(', ')

  return (
    <TextField
      select
      size="small"
      label={label}
      value={value}
      onChange={(event) => {
        const next = event.target.value as unknown as T[] | string
        onChange(typeof next === 'string' ? (next.split(',') as T[]) : next)
      }}
      // Fixed width so picking options never reflows the filter bar; long
      // labels end in "…" and the open menu shows everything.
      sx={{ width: { md: width } }}
      slotProps={{
        inputLabel: { shrink: true },
        select: {
          multiple: true,
          displayEmpty: true,
          // "All", one label, or the first label plus a count ("To Do +3").
          renderValue: (selected) => {
            const values = selected as T[]
            if (values.length === 0) return 'All'
            const first = labelOf(values[0])
            return values.length === 1
              ? first
              : `${first} +${values.length - 1}`
          },
          SelectDisplayProps: {
            ...testIdProps(testId),
            title: fullSelection || undefined,
          },
        },
      }}
    >
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          data-testid={`${testId}-option`}
        >
          <Checkbox size="small" checked={value.includes(option.value)} />
          <ListItemText primary={option.menuLabel ?? option.label} />
        </MenuItem>
      ))}
    </TextField>
  )
}
