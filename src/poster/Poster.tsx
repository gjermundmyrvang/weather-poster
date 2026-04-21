import React from 'react'
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { theme } from './theme.js'
import type { DayForecast } from '../api/forecast.js'

const s = StyleSheet.create({
  page: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.page,
    fontFamily: theme.fonts.family,
  },
  header: {
    marginBottom: 24,
    borderBottom: 4,
    borderBottomColor: theme.colors.textPrimary,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  location: {
    fontSize: 42,
    color: theme.colors.textPrimary,
    fontWeight: 700,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 6,
    fontWeight: 300,
    letterSpacing: 4,
  },
  updatedAt: {
    fontSize: 8,
    color: theme.colors.textSecondary,
    fontWeight: 300,
    letterSpacing: 1,
  },
  // Hero section
  heroSection: {
    borderLeft: 6,
    borderLeftColor: theme.colors.accent,
    paddingLeft: 24,
    marginBottom: 28,
    paddingTop: 20,
    paddingBottom: 20,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  heroLeft: {
    flexDirection: 'column',
    flex: 1,
  },
  heroLabel: {
    fontSize: 9,
    color: theme.colors.textSecondary,
    letterSpacing: 3,
    marginBottom: 12,
    fontWeight: 300,
  },
  heroTempRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  heroTemp: {
    fontSize: 96,
    color: theme.colors.textPrimary,
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: -2,
  },
  heroTempUnit: {
    fontSize: 32,
    color: theme.colors.textPrimary,
    fontWeight: 700,
    marginTop: 8,
  },
  heroCondition: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginTop: 12,
    fontWeight: 700,
    letterSpacing: 1,
  },
  heroIcon: {
    width: 100,
    height: 100,
    opacity: 0.9,
  },
  heroStatsGrid: {
    flexDirection: 'row',
    gap: 28,
    borderTop: 2,
    borderTopColor: theme.colors.divider,
    paddingTop: 16,
  },
  heroStat: {
    flexDirection: 'column',
  },
  heroStatLabel: {
    fontSize: 7,
    color: theme.colors.textSecondary,
    letterSpacing: 2,
    marginBottom: 4,
    fontWeight: 300,
  },
  heroStatValue: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: 700,
  },
  // Forecast grid
  forecastGrid: {
    flexDirection: 'row',
    gap: 0,
    border: 3,
    borderColor: theme.colors.textPrimary,
  },
  dayCard: {
    flex: 1,
    padding: 18,
    borderRight: 3,
    borderRightColor: theme.colors.textPrimary,
  },
  dayCardLast: {
    borderRight: 0,
  },
  dayHeader: {
    borderBottom: 2,
    borderBottomColor: theme.colors.divider,
    paddingBottom: 10,
    marginBottom: 12,
  },
  dayIcon: {
    width: 38,
    height: 38,
    marginBottom: 10,
  },
  dayName: {
    fontSize: 8,
    color: theme.colors.textSecondary,
    letterSpacing: 2,
    fontWeight: 300,
  },
  dayTempRow: {
    flexDirection: 'column',
    gap: 4,
    marginBottom: 12,
  },
  dayTempHigh: {
    fontSize: 28,
    color: theme.colors.textPrimary,
    fontWeight: 700,
  },
  dayTempLow: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: 300,
  },
  dayStat: {
    fontSize: 8,
    color: theme.colors.textSecondary,
    marginTop: 6,
    fontWeight: 300,
    letterSpacing: 0.5,
  },
  dayStatValue: {
    color: theme.colors.textPrimary,
    fontWeight: 700,
  },
  dayCondition: {
    fontSize: 8,
    color: theme.colors.textPrimary,
    marginTop: 8,
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: theme.spacing.page,
    left: theme.spacing.page,
    right: theme.spacing.page,
    borderTop: 2,
    borderTopColor: theme.colors.divider,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7,
    color: theme.colors.textSecondary,
    fontWeight: 300,
    letterSpacing: 1,
  },
})

function formatSymbol(code: string): string {
  return code
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/ Day| Night/i, '')
}

function windDirection(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(degrees / 45) % 8] ?? 'N'
}

interface PosterProps {
  locationName: string
  forecasts: DayForecast[]
  generatedAt: string
  icons: string[] // base64 data URLs, one per forecast day
}

export function Poster({
  locationName,
  forecasts,
  generatedAt,
  icons,
}: PosterProps): React.ReactElement {
  const today = forecasts[0]
  const upcoming = forecasts.slice(1)
  const todayIcon = icons[0]
  const upcomingIcons = icons.slice(1)

  console.log(todayIcon)

  if (!today) throw new Error('No forecast data available')

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerRow}>
            <View>
              <Text style={s.location}>{locationName.toUpperCase()}</Text>
              <Text style={s.subtitle}>WEATHER FORECAST</Text>
            </View>
            <Text style={s.updatedAt}>{generatedAt}</Text>
          </View>
        </View>

        {/* Today hero */}
        <View style={s.heroSection}>
          <View style={s.heroTop}>
            <View style={s.heroLeft}>
              <Text style={s.heroLabel}>TODAY — {today.date.toUpperCase()}</Text>
              <View style={s.heroTempRow}>
                <Text style={s.heroTemp}>{today.tempHigh}</Text>
                <Text style={s.heroTempUnit}>°C</Text>
              </View>
              <Text style={s.heroCondition}>{formatSymbol(today.symbolCode).toUpperCase()}</Text>
            </View>
            {todayIcon ? <Image style={s.heroIcon} src={todayIcon} /> : null}
          </View>
          <View style={s.heroStatsGrid}>
            <View style={s.heroStat}>
              <Text style={s.heroStatLabel}>FEELS LIKE</Text>
              <Text style={s.heroStatValue}>{today.feelsLike}°</Text>
            </View>
            <View style={s.heroStat}>
              <Text style={s.heroStatLabel}>LOW</Text>
              <Text style={s.heroStatValue}>{today.tempLow}°</Text>
            </View>
            <View style={s.heroStat}>
              <Text style={s.heroStatLabel}>WIND</Text>
              <Text style={s.heroStatValue}>
                {today.windSpeed} m/s {windDirection(today.windDirection)}
              </Text>
            </View>
            <View style={s.heroStat}>
              <Text style={s.heroStatLabel}>HUMIDITY</Text>
              <Text style={s.heroStatValue}>{today.humidity}%</Text>
            </View>
            <View style={s.heroStat}>
              <Text style={s.heroStatLabel}>PRECIP</Text>
              <Text style={s.heroStatValue}>{today.precipitation} mm</Text>
            </View>
          </View>
        </View>

        {/* Upcoming days */}
        <View style={s.forecastGrid}>
          {upcoming.map((day, i) => (
            <View
              key={day.date}
              style={[s.dayCard, ...(i === upcoming.length - 1 ? [s.dayCardLast] : [])]}
            >
              <View style={s.dayHeader}>
                {upcomingIcons[i] ? <Image style={s.dayIcon} src={upcomingIcons[i]!} /> : null}
                <Text style={s.dayName}>{day.date.toUpperCase()}</Text>
              </View>
              <View style={s.dayTempRow}>
                <Text style={s.dayTempHigh}>{day.tempHigh}°C</Text>
                <Text style={s.dayTempLow}>{day.tempLow}°C</Text>
              </View>
              <Text style={s.dayStat}>
                WIND{' '}
                <Text style={s.dayStatValue}>
                  {day.windSpeed} m/s {windDirection(day.windDirection)}
                </Text>
              </Text>
              <Text style={s.dayStat}>
                RAIN <Text style={s.dayStatValue}>{day.precipitation} mm</Text>
              </Text>
              <Text style={s.dayStat}>
                HUM <Text style={s.dayStatValue}>{day.humidity}%</Text>
              </Text>
              <Text style={s.dayCondition}>{formatSymbol(day.symbolCode).toUpperCase()}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>DATA: MET NORWAY / API.MET.NO</Text>
          <Text style={s.footerText}>WEATHER-POSTER</Text>
        </View>
      </Page>
    </Document>
  )
}
