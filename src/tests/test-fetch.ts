import { fetchWeather } from '../api/metno.js'

const data = await fetchWeather({ lat: 59.93, lon: 10.72, altitude: 90 })

const first = data.properties.timeseries[0]
if (!first) {
  throw new Error('No timeseries data returned from API')
}

console.log('Updated at:', data.properties.meta.updated_at)
console.log('First entry time:', first.time)
console.log('Temperature:', first.data.instant.details.air_temperature, '°C')
console.log('Wind speed:', first.data.instant.details.wind_speed, 'm/s')
