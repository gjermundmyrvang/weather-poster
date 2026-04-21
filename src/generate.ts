import { renderToBuffer } from '@react-pdf/renderer'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import React from 'react'
import { fetchWeather } from './api/metno.js'
import { extractDailyForecasts } from './api/forecast.js'
import { Poster } from './poster/Poster.js'
import { downloadIcons } from './icons/downloadIcons.js'
import { getIconBase64 } from './icons/getIcon.js'

interface Args {
  lat: number
  lon: number
  altitude?: number
  location: string
  days: number
}

function parseArgs(): Args {
  const args = process.argv.slice(2)

  const get = (flag: string): string | undefined => {
    const index = args.indexOf(flag)
    return index !== -1 ? args[index + 1] : undefined
  }

  const lat = parseFloat(get('--lat') ?? '')
  const lon = parseFloat(get('--lon') ?? '')
  const altitude = get('--altitude') ? parseInt(get('--altitude')!, 10) : undefined
  const location = get('--location') ?? 'Unknown Location'
  const days = parseInt(get('--days') ?? '4', 10)

  if (isNaN(lat) || isNaN(lon)) {
    console.error(
      'Usage: tsx src/generate.ts --lat <lat> --lon <lon> [--altitude <alt>] [--location <name>] [--days <1-7>]',
    )
    process.exit(1)
  }

  return {
    lat,
    lon,
    location,
    days,
    ...(altitude !== undefined && { altitude }),
  }
}

async function main(): Promise<void> {
  const args = parseArgs()

  console.log(`Fetching weather for ${args.location} (${args.lat}, ${args.lon})...`)
  const weatherData = await fetchWeather({
    lat: args.lat,
    lon: args.lon,
    ...(args.altitude !== undefined && { altitude: args.altitude }),
  })

  console.log('Extracting forecasts...')
  const forecasts = extractDailyForecasts(weatherData.properties.timeseries, args.days)

  console.log('Downloading icons...')
  await downloadIcons()

  console.log('Loading icons...')
  const icons = await Promise.all(forecasts.map((f) => getIconBase64(f.symbolCode)))

  const generatedAt = new Date().toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  console.log('Rendering PDF...')
  const element = React.createElement(Poster, {
    locationName: args.location,
    forecasts,
    generatedAt,
    icons,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(element as any)

  await mkdir('output', { recursive: true })

  const filename = `${args.location.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`
  const outputPath = join('output', filename)
  await writeFile(outputPath, buffer)

  console.log(`✓ PDF saved to ${outputPath}`)
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
