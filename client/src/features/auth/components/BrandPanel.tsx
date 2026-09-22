import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import GridViewIcon from '@mui/icons-material/GridView'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import SearchIcon from '@mui/icons-material/Search'
import type { SxProps } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

const FEATURES = [
  { icon: GridViewIcon, label: 'Kanban boards for every project' },
  { icon: GroupOutlinedIcon, label: "Assign tasks and track who's doing what" },
  { icon: SearchIcon, label: 'Search and filter across every board' },
]

const styles = {
  root: {
    width: 560,
    flexShrink: 0,
    display: { xs: 'none', md: 'flex' },
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
    p: 7,
    background:
      'linear-gradient(160deg, #123A66 0%, #1976D2 60%, #3B93E0 100%)',
  },
  circleTopRight: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.14)',
    top: -140,
    right: -120,
  },
  circleBottomLeft: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.10)',
    bottom: -220,
    left: -160,
  },
  logoRow: {
    position: 'relative',
    alignItems: 'center',
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: '8px',
    bgcolor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'primary.main',
    fontWeight: 700,
    fontSize: 15,
  },
  logoText: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 20,
  },
  headlineStack: {
    position: 'relative',
    maxWidth: 400,
  },
  headline: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 30,
    lineHeight: 1.3,
  },
  subhead: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 14,
    lineHeight: 1.6,
  },
  featureList: {
    position: 'relative',
  },
  featureRow: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 16,
    color: '#fff',
  },
  featureLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
} satisfies Record<string, SxProps<Theme>>

export function BrandPanel() {
  return (
    <Box sx={styles.root}>
      <Box sx={styles.circleTopRight} />
      <Box sx={styles.circleBottomLeft} />

      <Stack
        direction="row"
        spacing={1.25}
        sx={{ position: 'relative', alignItems: 'center' }}
      >
        <Box sx={styles.logoBadge}>TF</Box>
        <Typography sx={styles.logoText}>TaskFlow</Typography>
      </Stack>

      <Stack spacing={2} sx={styles.headlineStack}>
        <Typography sx={styles.headline}>
          Organize. Collaborate. Get things done.
        </Typography>
        <Typography sx={styles.subhead}>
          Plan projects, track tasks across boards, and keep your work moving —
          a lightweight, visual way to stay organized.
        </Typography>
      </Stack>

      <Stack spacing={1.75} sx={styles.featureList}>
        {FEATURES.map(({ icon: Icon, label }) => (
          <Stack
            key={label}
            direction="row"
            spacing={1.25}
            sx={styles.featureRow}
          >
            <Icon sx={styles.featureIcon} />
            <Typography sx={styles.featureLabel}>{label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
