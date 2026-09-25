import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'

export function MultiSelectFilter<T extends string>({
  label,
  value,
  options,
  onChange,
  minWidth = 160,
}: {
  label: string
  value: T[]
  options: { value: T; label: string }[]
  onChange: (next: T[]) => void
  minWidth?: number
}) {
  const labelOf = (v: T) => options.find((o) => o.value === v)?.label ?? v

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
      sx={{ minWidth }}
      slotProps={{
        inputLabel: { shrink: true },
        select: {
          multiple: true,
          displayEmpty: true,
          renderValue: (selected) => {
            const values = selected as T[]
            return values.length ? values.map(labelOf).join(', ') : 'All'
          },
        },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Checkbox size="small" checked={value.includes(option.value)} />
          <ListItemText primary={option.label} />
        </MenuItem>
      ))}
    </TextField>
  )
}
