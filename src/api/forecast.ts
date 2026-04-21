import type { TimeseriesEntry } from './types.js'

export interface DayForecast {
  date: string
  tempHigh: number
  tempLow: number
  feelsLike: number
  symbolCode: string
  windSpeed: number
  windDirection: number
  precipitation: number
  humidity: number
}

function calcFeelsLike(temp: number, windSpeed: number, humidity: number): number {
  if (temp < 10 && windSpeed > 1.33) {
    // Wind chill
    const v = Math.pow(windSpeed * 3.6, 0.16)
    return Math.round(13.12 + 0.6215 * temp - 11.37 * v + 0.3965 * temp * v)
  }
  if (temp > 26 && humidity > 40) {
    // Heat index
    return Math.round(-8.78 + 1.611 * temp - 0.012 * humidity + 0.001 * temp * humidity)
  }
  return temp
}

export function extractDailyForecasts(
  timeseries: TimeseriesEntry[],
  days: number = 4,
): DayForecast[] {
  const byDate = new Map<string, TimeseriesEntry[]>()

  for (const entry of timeseries) {
    const date = entry.time.slice(0, 10)
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

      const noonEntry = entries.find((e) => e.time.includes('T12:00')) ?? entries[0]

      if (!noonEntry) throw new Error(`No entries found for date ${dateStr}`)

      const symbolCode =
        noonEntry.data.next_6_hours?.summary.symbol_code ??
        noonEntry.data.next_1_hours?.summary.symbol_code ??
        'cloudy'

      const windSpeed = noonEntry.data.instant.details.wind_speed ?? 0
      const windDirection = noonEntry.data.instant.details.wind_from_direction ?? 0
      const humidity = noonEntry.data.instant.details.relative_humidity ?? 0

      const precipitation = entries.reduce((sum, e) => {
        return sum + (e.data.next_6_hours?.details?.precipitation_amount ?? 0)
      }, 0)

      const feelsLike = calcFeelsLike(
        noonEntry.data.instant.details.air_temperature ?? tempHigh,
        windSpeed,
        humidity,
      )

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
        feelsLike,
        symbolCode,
        windSpeed: Math.round(windSpeed * 10) / 10,
        windDirection: Math.round(windDirection),
        precipitation: Math.round(precipitation * 10) / 10,
        humidity: Math.round(humidity),
      }
    })
}
