/**
 * Theme system interfaces.
 *
 * Themes define color palettes and typography for a tenant's site.
 */

export type ThemeColorMode = 'light' | 'dark' | 'brand'

export interface ThemeColor {
  name: string
  value: string
}

export interface ThemeFont {
  name: string
  family: string
  googleFont?: string
}

export interface ThemeDefinition {
  id: string
  name: string
  slug: string
  mode: ThemeColorMode
  description: string
  colors: {
    primary: ThemeColor
    secondary: ThemeColor
    accent: ThemeColor
    background: ThemeColor
    foreground: ThemeColor
    card: ThemeColor
    border: ThemeColor
  }
  fonts: {
    sans: ThemeFont
    heading: ThemeFont
    mono?: ThemeFont
  }
  previewImage?: string
}

export const THEMES: ThemeDefinition[] = [
  {
    id: 'light',
    name: 'Light',
    slug: 'light',
    mode: 'light',
    description: 'Clean and bright with a neutral white background.',
    colors: {
      primary: { name: 'Primary', value: '#2563eb' },
      secondary: { name: 'Secondary', value: '#6b7280' },
      accent: { name: 'Accent', value: '#8b5cf6' },
      background: { name: 'Background', value: '#ffffff' },
      foreground: { name: 'Foreground', value: '#111827' },
      card: { name: 'Card', value: '#f9fafb' },
      border: { name: 'Border', value: '#e5e7eb' },
    },
    fonts: {
      sans: {
        name: 'Inter',
        family: 'Inter, system-ui, sans-serif',
        googleFont: 'Inter',
      },
      heading: {
        name: 'Inter',
        family: 'Inter, system-ui, sans-serif',
        googleFont: 'Inter',
      },
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    slug: 'dark',
    mode: 'dark',
    description: 'Sleek dark mode with deep backgrounds and high contrast.',
    colors: {
      primary: { name: 'Primary', value: '#3b82f6' },
      secondary: { name: 'Secondary', value: '#9ca3af' },
      accent: { name: 'Accent', value: '#a78bfa' },
      background: { name: 'Background', value: '#0f1117' },
      foreground: { name: 'Foreground', value: '#f3f4f6' },
      card: { name: 'Card', value: '#1a1a2e' },
      border: { name: 'Border', value: '#374151' },
    },
    fonts: {
      sans: {
        name: 'Inter',
        family: 'Inter, system-ui, sans-serif',
        googleFont: 'Inter',
      },
      heading: {
        name: 'Inter',
        family: 'Inter, system-ui, sans-serif',
        googleFont: 'Inter',
      },
    },
  },
  {
    id: 'brand',
    name: 'Brand',
    slug: 'brand',
    mode: 'light',
    description: 'Warm brand colors with amber and earth tones.',
    colors: {
      primary: { name: 'Primary', value: '#ea580c' },
      secondary: { name: 'Secondary', value: '#6b7280' },
      accent: { name: 'Accent', value: '#8b5cf6' },
      background: { name: 'Background', value: '#fafaf9' },
      foreground: { name: 'Foreground', value: '#292524' },
      card: { name: 'Card', value: '#ffffff' },
      border: { name: 'Border', value: '#e7e5e4' },
    },
    fonts: {
      sans: {
        name: 'Inter',
        family: 'Inter, system-ui, sans-serif',
        googleFont: 'Inter',
      },
      heading: {
        name: 'Cormorant Garamond',
        family: 'Cormorant Garamond, Georgia, serif',
        googleFont: 'Cormorant Garamond',
      },
    },
  },
]

export const getTheme = (id: string): ThemeDefinition | undefined =>
  THEMES.find((t) => t.id === id || t.slug === id)

export const getThemeClass = (mode: ThemeColorMode): string => {
  if (mode === 'dark') return 'dark'
  if (mode === 'brand') return 'brand'
  return 'light'
}
