import type { TimeseriesEntry } from './types.js'

export interface DayForecast {
  date: string // e.g. "Monday 21 Apr"
  tempHigh: number
  tempLow: number
  symbolCode: string // e.g. "clearsky_day"
  windSpeed: number
  precipitation: number
}

export function extractDailyForecasts(
  timeseries: TimeseriesEntry[],
  days: number = 4,
): DayForecast[] {
  // Group entries by date
  const byDate = new Map<string, TimeseriesEntry[]>()

  for (const entry of timeseries) {
    const date = entry.time.slice(0, 10) // "2024-01-15"
    const existing = byDate.get(date) ?? []
    byDate.set(date, [...existing, entry])
  }

  return Array.from(byDate.entries())
    .slice(0, days)
    .map(([dateStr, entries]): DayForecast => {
      const temps = entries
        .map((e) => e.data.instant.details.air_temperature)
        .filter((t): t is number => t !== undefined)

      const tempHigh = Math.max(...temps)
      const tempLow = Math.min(...temps)

      // Use the noon entry for the symbol, fall back to first available
      const noonEntry = entries.find((e) => e.time.includes('T12:00')) ?? entries[0]

      if (!noonEntry) {
        throw new Error(`No entries found for date ${dateStr}`)
      }

      const symbolCode =
        noonEntry.data.next_6_hours?.summary.symbol_code ??
        noonEntry.data.next_1_hours?.summary.symbol_code ??
        'cloudy'

      const windSpeed = noonEntry.data.instant.details.wind_speed ?? 0

      const precipitation = entries.reduce((sum, e) => {
        return sum + (e.data.next_6_hours?.details?.precipitation_amount ?? 0)
      }, 0)

      const date = new Date(dateStr)
      const formatted = date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
      })

      return {
        date: formatted,
        tempHigh: Math.round(tempHigh),
        tempLow: Math.round(tempLow),
        symbolCode,
        windSpeed: Math.round(windSpeed * 10) / 10,
        precipitation: Math.round(precipitation * 10) / 10,
      }
    })
}
