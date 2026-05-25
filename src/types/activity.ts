export interface Activity {
  id: string
  tripId: string
  dayIndex: number
  title: string
  description: string
  location: {
    name: string
    lat: number
    lng: number
    address?: string
  }
  startTime: string
  endTime: string
  category: ActivityCategory
  cost: number
  currency: string
  bookingUrl?: string
  affiliateUrl?: string
  notes?: string
}

export type ActivityCategory =
  | 'transport'
  | 'accommodation'
  | 'food'
  | 'sightseeing'
  | 'activity'
  | 'shopping'
  | 'other'

export interface DayItinerary {
  dayIndex: number
  date: string
  activities: Activity[]
}
