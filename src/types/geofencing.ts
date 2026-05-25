export interface GeofenceZone {
  activityId: string
  center: { lat: number; lng: number }
  radius: number
  alertLevel: AlertLevelNumber
}

export type AlertLevelNumber = 1 | 2 | 3 | 4 | 5

export interface GeofenceEvent {
  type: 'enter' | 'exit'
  zone: GeofenceZone
  timestamp: number
  userLocation: { lat: number; lng: number }
}

export interface UserLocation {
  lat: number
  lng: number
  accuracy: number
  timestamp: number
}
