import type { AlertLevelNumber } from '@/types/geofencing'

export const ALERT_LEVEL_LABELS: Record<AlertLevelNumber, string> = {
  1: 'Proximity Alert',
  2: 'Approaching',
  3: 'Nearby',
  4: 'Arriving',
  5: 'On-Site',
} as const

export const ALERT_LEVEL_COLORS: Record<AlertLevelNumber, string> = {
  1: '#3B82F6',
  2: '#10B981',
  3: '#F59E0B',
  4: '#EF4444',
  5: '#8B5CF6',
} as const
