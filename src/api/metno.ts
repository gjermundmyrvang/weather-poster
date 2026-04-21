import { MetNoResponseSchema, type MetNoResponse } from './types.js'

const BASE_URL = 'https://api.met.no/weatherapi/locationforecast/2.0'

const HEADERS = {
  'User-Agent': 'weather-poster/github.com/gjermundmyrvang/weather-poster',
}

export interface FetchWeatherParams {
  lat: number
  lon: number
  altitude?: number
}

export async function fetchWeather(params: FetchWeatherParams): Promise<MetNoResponse> {
  const { lat, lon, altitude } = params

  const url = new URL(`${BASE_URL}/compact`)
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lon))
  if (altitude !== undefined) {
    url.searchParams.set('altitude', String(altitude))
  }

  const response = await fetch(url.toString(), { headers: HEADERS })

  if (!response.ok) {
    throw new Error(`met.no API error: ${response.status} ${response.statusText}`)
  }

  const raw = await response.json()

  const parsed = MetNoResponseSchema.safeParse(raw)

  if (!parsed.success) {
    throw new Error(`Unexpected API response shape: ${parsed.error.message}`)
  }

  return parsed.data
}
