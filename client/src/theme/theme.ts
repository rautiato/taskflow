import { createTheme } from '@mui/material/styles'

const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#1976D2',
      dark: '#115293',
      light: '#E8F0FE',
    },
    error: {
      main: '#D32F2F',
      light: '#FDECEA',
    },
    success: {
      main: '#1E7E34',
      light: '#E6F4EA',
    },
    warning: {
      main: '#ED6C02',
      light: '#FFF4E5',
    },
    background: {
      default: '#F4F5F7',
      paper: '#FFFFFF',
      subtle: '#F5F6F8', // header rows in lists
    },
    text: {
      primary: '#1D1F23',
      secondary: '#5F6368',
    },
    divider: '#E0E3E8',
  },

  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
      styleOverrides: {
        // With no underline, a darker colour is the hover cue.
        root: ({ theme, ownerState }) => ({
          transition: theme.transitions.create('color'),
          '&:hover': {
            color:
              ownerState.color === 'error'
                ? theme.palette.error.dark
                : ownerState.color === 'text.secondary'
                  ? theme.palette.text.primary
                  : theme.palette.primary.dark,
          },
        }),
      },
    },
    MuiTextField: {
      defaultProps: {
        slotProps: {
          inputLabel: { shrink: true },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.variant === 'standard' &&
            ownerState.severity === 'error' && {
              color: '#D32F2F',
              backgroundColor: '#FDECEA',
            }),
        }),
      },
    },
  },
})

// App text styles, built on body1 so they keep its font, line height and
// letter spacing.
const { body1 } = baseTheme.typography
const { secondary } = baseTheme.palette.text

export const theme = createTheme(baseTheme, {
  typography: {
    pageTitle: { ...body1, fontSize: 24, fontWeight: 700 },
    pageSubtitle: { ...body1, fontSize: 14, color: secondary },
    sectionTitle: { ...body1, fontSize: 16, fontWeight: 700 },
    secondaryText: { ...body1, fontSize: 13, color: secondary },
    // Small uppercase heading above a group of fields or content
    // ("DESCRIPTION", "COMMENTS", a stat tile's name).
    sectionLabel: {
      ...body1,
      fontSize: 12,
      fontWeight: 700,
      color: secondary,
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        // Custom variants otherwise render as <span>, which would break layout.
        // The page title is the page's main heading, for screen readers and
        // heading navigation.
        variantMapping: {
          pageTitle: 'h1',
          pageSubtitle: 'p',
          sectionTitle: 'p',
          secondaryText: 'p',
          sectionLabel: 'p',
        },
      },
    },
  },
})
