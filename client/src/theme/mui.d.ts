import type { CSSProperties } from 'react'

// Types for the custom theme values in theme.ts.
declare module '@mui/material/styles' {
  interface TypographyVariants {
    pageTitle: CSSProperties
    pageSubtitle: CSSProperties
    sectionTitle: CSSProperties
    secondaryText: CSSProperties
  }
  interface TypographyVariantsOptions {
    pageTitle?: CSSProperties
    pageSubtitle?: CSSProperties
    sectionTitle?: CSSProperties
    secondaryText?: CSSProperties
  }
  interface TypeBackground {
    subtle: string
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    pageTitle: true
    pageSubtitle: true
    sectionTitle: true
    secondaryText: true
  }
}
