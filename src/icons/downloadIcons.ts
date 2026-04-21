import { writeFile, mkdir, access } from 'fs/promises'
import { join } from 'path'

const ICON_BASE = 'https://github.com/metno/weathericons/tree/main/weather/svg'
const ICON_DIR = join(process.cwd(), 'src', 'icons', 'svg')

// The most common symbol codes we'll encounter
const COMMON_ICONS = [
  'clearsky_day',
  'clearsky_night',
  'fair_day',
  'fair_night',
  'partlycloudy_day',
  'partlycloudy_night',
  'cloudy',
  'fog',
  'lightrain',
  'rain',
  'heavyrain',
  'lightrainshowers_day',
  'rainshowers_day',
  'heavyrainshowers_day',
  'lightsleet',
  'sleet',
  'heavysleet',
  'lightsnow',
  'snow',
  'heavysnow',
  'lightsnowshowers_day',
  'snowshowers_day',
  'thunder',
  'rainandthunder',
  'heavyrainandthunder',
]

export async function downloadIcons(): Promise<void> {
  await mkdir(ICON_DIR, { recursive: true })

  const results = await Promise.allSettled(
    COMMON_ICONS.map(async (name) => {
      const filePath = join(ICON_DIR, `${name}.svg`)

      // Skip if already cached
      try {
        await access(filePath)
        return
      } catch {
        // File doesn't exist, download it
      }

      const url = `${ICON_BASE}/${name}.svg`
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Failed to fetch icon ${name}: ${response.status}`)
      const svg = await response.text()
      await writeFile(filePath, svg, 'utf-8')
      console.log(`  Downloaded ${name}.svg`)
    }),
  )

  const failed = results.filter((r) => r.status === 'rejected')
  if (failed.length > 0) {
    console.warn(`  Warning: ${failed.length} icons failed to download`)
  }
}
