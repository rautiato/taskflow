import Avatar from '@mui/material/Avatar'

const SIZES = {
  sm: { box: 36, font: 13 },
  md: { box: 38, font: 14 },
} as const

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function UserAvatar({
  name,
  size = 'md',
}: {
  name: string
  size?: 'sm' | 'md'
}) {
  const { box, font } = SIZES[size]

  return (
    <Avatar
      sx={{
        width: box,
        height: box,
        bgcolor: 'primary.dark',
        fontSize: font,
        fontWeight: 700,
      }}
    >
      {getInitials(name)}
    </Avatar>
  )
}
