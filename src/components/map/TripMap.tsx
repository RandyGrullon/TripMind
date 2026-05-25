'use client'

import type { Activity } from '@/types/activity'
import type { UserLocation } from '@/types/geofencing'

interface TripMapProps {
  activities: Activity[]
  userLocation?: UserLocation
}

export function TripMap(_props: TripMapProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-gray-200">
      <p className="absolute inset-0 flex items-center justify-center text-gray-500">
        Map loading...
      </p>
    </div>
  )
}
