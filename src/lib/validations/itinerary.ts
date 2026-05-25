import { z } from 'zod'

export const locationSchema = z.object({
  name: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().optional(),
})

export const activitySchema = z.object({
  id: z.string(),
  tripId: z.string(),
  dayIndex: z.number().int().nonnegative(),
  title: z.string().min(1),
  description: z.string(),
  location: locationSchema,
  startTime: z.string(),
  endTime: z.string(),
  category: z.enum([
    'transport',
    'accommodation',
    'food',
    'sightseeing',
    'activity',
    'shopping',
    'other',
  ]),
  cost: z.number().nonnegative(),
  currency: z.string().length(3),
})

export type ValidatedActivity = z.infer<typeof activitySchema>
