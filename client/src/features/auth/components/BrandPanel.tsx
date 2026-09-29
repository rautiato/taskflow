import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import GridViewIcon from '@mui/icons-material/GridView'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import SearchIcon from '@mui/icons-material/Search'
import type { SxProps } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import { Logo } from '../../../components/Logo'

const FEATURES = [
  {
    id: 'kanban',
    icon: GridViewIcon,
    label: 'Kanban boards for every project',
  },
  {
    id: 'assign',
    icon: GroupOutlinedIcon,
    label: "Assign tasks and track who's doing what",
  },
  {
    id: 'search',
    icon: SearchIcon,
    label: 'Search and filter across every board',
  },
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
  logoText: {
    color: 'common.white',
    fontWeight: 700,
    fontSize: 20,
  },
  headlineStack: {
    position: 'relative',
    maxWidth: 400,
  },
  headline: {
    color: 'common.white',
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
    color: 'common.white',
  },
  featureLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
} satisfies Record<string, SxProps<Theme>>

export function BrandPanel() {
  return (
    <Box sx={styles.root} data-testid="brand-panel">
      <Box sx={styles.circleTopRight} />
      <Box sx={styles.circleBottomLeft} />

      <Stack direction="row" spacing={1.25} sx={styles.logoRow}>
        <Logo variant="inverted" />
        <Typography data-testid="brand-panel-logo-text" sx={styles.logoText}>
          TaskFlow
        </Typography>
      </Stack>

      <Stack spacing={2} sx={styles.headlineStack}>
        <Typography data-testid="brand-panel-headline" sx={styles.headline}>
          Organize. Collaborate. Get things done.
        </Typography>
        <Typography data-testid="brand-panel-subhead" sx={styles.subhead}>
          Plan projects, track tasks across boards, and keep your work moving —
          a lightweight, visual way to stay organized.
        </Typography>
      </Stack>

      <Stack
        spacing={1.75}
        sx={styles.featureList}
        data-testid="brand-panel-features"
      >
        {FEATURES.map(({ id, icon: Icon, label }) => (
          <Stack
            key={id}
            direction="row"
            spacing={1.25}
            sx={styles.featureRow}
            data-testid={`brand-panel-feature-${id}`}
          >
            <Icon sx={styles.featureIcon} />
            <Typography
              data-testid={`brand-panel-feature-${id}-label`}
              sx={styles.featureLabel}
            >
              {label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
