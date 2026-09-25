import Avatar from '@mui/material/Avatar'

const SIZES = {
  xs: { box: 24, font: 10 },
  sm: { box: 36, font: 13 },
  md: { box: 38, font: 14 },
  lg: { box: 72, font: 24 },
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

// Hashes a stable identity key (user id) rather than the display name, so a
// user's color doesn't change if they rename themselves — matching how
// Slack/Trello key their avatar colors off member id, not display name.
function colorForKey(key: string): string {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  return PALETTE[hash % PALETTE.length]
}

export function UserAvatar({
  id = null,
  name,
  avatarUrl = null,
  size = 'md',
}: {
  id?: string | null
  name: string | null
  avatarUrl?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg'
}) {
  const { box, font } = SIZES[size]
  const colorKey = id ?? name

  return (
    <Avatar
      src={avatarUrl ?? undefined}
      sx={{
        width: box,
        height: box,
        fontSize: font,
        fontWeight: 700,
        bgcolor: colorKey ? colorForKey(colorKey) : UNASSIGNED_COLOR,
        color: '#FFFFFF',
      }}
    >
      {name ? getInitials(name) : '?'}
    </Avatar>
  )
}
