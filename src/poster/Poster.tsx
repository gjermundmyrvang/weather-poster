import React from 'react'
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { theme } from './theme.js'
import type { DayForecast } from '../api/forecast.js'

const s = StyleSheet.create({
  page: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.page,
    fontFamily: theme.fonts.body,
  },
  // Header
  header: {
    marginBottom: 32,
  },
  location: {
    fontSize: 36,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.heading,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  accentLine: {
    height: 2,
    backgroundColor: theme.colors.accent,
    width: 48,
    marginTop: 12,
  },
  // Today hero card
  heroCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 28,
    marginBottom: 20,
  },
  heroLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    letterSpacing: 2,
    marginBottom: 12,
  },
  heroTemp: {
    fontSize: 72,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.heading,
    lineHeight: 1,
  },
  heroTempUnit: {
    fontSize: 32,
    color: theme.colors.accent,
    fontFamily: theme.fonts.heading,
  },
  heroRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 24,
  },
  heroStat: {
    flexDirection: 'column',
  },
  heroStatLabel: {
    fontSize: 9,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 3,
  },
  heroStatValue: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.heading,
  },
  heroCondition: {
    fontSize: 14,
    color: theme.colors.accentWarm,
    marginTop: 10,
    fontFamily: theme.fonts.heading,
  },
  // Forecast row
  forecastGrid: {
    flexDirection: 'row',
    gap: theme.spacing.gap,
  },
  dayCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 10,
    padding: theme.spacing.card,
  },
  dayName: {
    fontSize: 9,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 10,
  },
  dayTempHigh: {
    fontSize: 22,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.heading,
  },
  dayTempLow: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  dayDivider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: 10,
  },
  dayStat: {
    fontSize: 9,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  dayStatValue: {
    color: theme.colors.textPrimary,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: theme.spacing.page,
    left: theme.spacing.page,
    right: theme.spacing.page,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: theme.colors.textSecondary,
  },
})

function formatSymbol(code: string): string {
  return code
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/ Day| Night/, '')
}

interface PosterProps {
  locationName: string
  forecasts: DayForecast[]
  generatedAt: string
}

export function Poster({ locationName, forecasts, generatedAt }: PosterProps): React.ReactElement {
  const today = forecasts[0]
  const upcoming = forecasts.slice(1)

  if (!today) {
    throw new Error('No forecast data available')
  }

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.location}>{locationName.toUpperCase()}</Text>
          <Text style={s.subtitle}>Weather Forecast</Text>
          <View style={s.accentLine} />
        </View>

        {/* Today hero */}
        <View style={s.heroCard}>
          <Text style={s.heroLabel}>TODAY — {today.date.toUpperCase()}</Text>
          <Text style={s.heroTemp}>
            {today.tempHigh}
            <Text style={s.heroTempUnit}>°C</Text>
          </Text>
          <Text style={s.heroCondition}>{formatSymbol(today.symbolCode)}</Text>
          <View style={s.heroRow}>
            <View style={s.heroStat}>
              <Text style={s.heroStatLabel}>LOW</Text>
              <Text style={s.heroStatValue}>{today.tempLow}°C</Text>
            </View>
            <View style={s.heroStat}>
              <Text style={s.heroStatLabel}>WIND</Text>
              <Text style={s.heroStatValue}>{today.windSpeed} m/s</Text>
            </View>
            <View style={s.heroStat}>
              <Text style={s.heroStatLabel}>PRECIP</Text>
              <Text style={s.heroStatValue}>{today.precipitation} mm</Text>
            </View>
          </View>
        </View>

        {/* Upcoming days */}
        <View style={s.forecastGrid}>
          {upcoming.map((day) => (
            <View key={day.date} style={s.dayCard}>
              <Text style={s.dayName}>{day.date.toUpperCase()}</Text>
              <Text style={s.dayTempHigh}>{day.tempHigh}°C</Text>
              <Text style={s.dayTempLow}>{day.tempLow}°C</Text>
              <View style={s.dayDivider} />
              <Text style={s.dayStat}>
                WIND <Text style={s.dayStatValue}>{day.windSpeed} m/s</Text>
              </Text>
              <Text style={s.dayStat}>
                RAIN <Text style={s.dayStatValue}>{day.precipitation} mm</Text>
              </Text>
              <Text style={s.dayStat}>
                <Text style={s.dayStatValue}>{formatSymbol(day.symbolCode)}</Text>
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>Generated {generatedAt}</Text>
          <Text style={s.footerText}>Data: MET Norway</Text>
        </View>
      </Page>
    </Document>
  )
}
