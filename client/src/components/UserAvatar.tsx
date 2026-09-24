import Avatar from '@mui/material/Avatar'

const SIZES = {
  xs: { box: 24, font: 10 },
  sm: { box: 36, font: 13 },
  md: { box: 38, font: 14 },
} as const

const PALETTE = [
  '#1976D2',
  '#2E7D32',
  '#E65100',
  '#6A1B9A',
  '#AD1457',
  '#00838F',
] as const

const UNASSIGNED_COLOR = '#6B7280'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function colorForName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return PALETTE[hash % PALETTE.length]
}

export function UserAvatar({
  name,
  size = 'md',
}: {
  name: string | null
  size?: 'xs' | 'sm' | 'md'
}) {
  const { box, font } = SIZES[size]

  return (
    <Avatar
      sx={{
        width: box,
        height: box,
        fontSize: font,
        fontWeight: 700,
        bgcolor: name ? colorForName(name) : UNASSIGNED_COLOR,
        color: '#FFFFFF',
      }}
    >
      {name ? getInitials(name) : '?'}
    </Avatar>
  )
}
