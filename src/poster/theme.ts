import { Font } from '@react-pdf/renderer'
import { join } from 'path'

Font.register({
  family: 'Inter',
  fonts: [
    { src: join(process.cwd(), 'src/fonts/Inter-Regular.otf'), fontWeight: 400 },
    { src: join(process.cwd(), 'src/fonts/Inter-Bold.otf'), fontWeight: 700 },
    { src: join(process.cwd(), 'src/fonts/Inter-Light.otf'), fontWeight: 300 },
  ],
})

export const theme = {
  colors: {
    background: '#070d16',
    card: '#1A2E45',
    accent: '#4A9EFF',
    accentWarm: '#FFB347',
    textPrimary: '#FFFFFF',
    textSecondary: '#8BA8C4',
    divider: '#1E3A5F',
  },
  fonts: {
    family: 'Inter',
  },
  spacing: {
    page: 40,
    card: 20,
    gap: 12,
  },
  size: {
    width: 595,
    height: 842,
  },
} as const
