import type { AlertLevelNumber } from './geofencing'

export interface Alert {
  id: string
  level: AlertLevelNumber
  title: string
  message: string
  activityId: string
  timestamp: number
  acknowledged: boolean
  actions?: AlertAction[]
}

export interface AlertAction {
  label: string
  type: 'reschedule' | 'navigate' | 'book' | 'dismiss'
  url?: string
}
