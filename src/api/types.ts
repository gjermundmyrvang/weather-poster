import { z } from 'zod'

// The instant weather details at a point in time
const InstantDetailsSchema = z.object({
  air_pressure_at_sea_level: z.number().optional(),
  air_temperature: z.number().optional(),
  cloud_area_fraction: z.number().optional(),
  relative_humidity: z.number().optional(),
  wind_from_direction: z.number().optional(),
  wind_speed: z.number().optional(),
})

// A forecast period (1h, 6h, 12h) with a summary symbol
const ForecastPeriodSchema = z.object({
  details: z
    .object({
      precipitation_amount: z.number().optional(),
    })
    .optional(),
  summary: z.object({
    symbol_code: z.string(),
  }),
})

// A single entry in the timeseries array
const TimeseriesEntrySchema = z.object({
  time: z.string(), // ISO 8601 string, e.g. "2024-01-15T12:00:00Z"
  data: z.object({
    instant: z.object({
      details: InstantDetailsSchema,
    }),
    next_1_hours: ForecastPeriodSchema.optional(),
    next_6_hours: ForecastPeriodSchema.optional(),
    next_12_hours: ForecastPeriodSchema.optional(),
  }),
})

// The full API response
export const MetNoResponseSchema = z.object({
  type: z.string(),
  geometry: z.object({
    type: z.string(),
    coordinates: z.tuple([z.number(), z.number(), z.number()]),
  }),
  properties: z.object({
    meta: z.object({
      updated_at: z.string(),
      units: z.record(z.string(), z.string()),
    }),
    timeseries: z.array(TimeseriesEntrySchema),
  }),
})

// Infer TypeScript types from the schemas — no duplication
export type MetNoResponse = z.infer<typeof MetNoResponseSchema>
export type TimeseriesEntry = z.infer<typeof TimeseriesEntrySchema>
export type InstantDetails = z.infer<typeof InstantDetailsSchema>
export type ForecastPeriod = z.infer<typeof ForecastPeriodSchema>
