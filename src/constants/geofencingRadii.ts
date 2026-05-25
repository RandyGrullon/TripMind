import type { AlertLevelNumber } from '@/types/geofencing'

export const GEOFENCING_RADII: Record<AlertLevelNumber, number> = {
  1: 5000,
  2: 2000,
  3: 500,
  4: 100,
  5: 50,
} as const
