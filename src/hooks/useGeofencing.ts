import { useState, useEffect, useRef } from 'react'
import type {
  GeofenceZone,
  GeofenceEvent,
  UserLocation,
} from '@/types/geofencing'
import { detectZoneEvents } from '@/lib/geofencing/alertEngine'

export function useGeofencing(
  location: UserLocation | null,
  zones: GeofenceZone[]
): { events: GeofenceEvent[]; insideZones: Set<string> } {
  const insideRef = useRef<Set<string>>(new Set())
  const [events, setEvents] = useState<GeofenceEvent[]>([])
  const [insideZones, setInsideZones] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!location) return

    const newEvents = detectZoneEvents(location, zones, insideRef.current)

    if (newEvents.length > 0) {
      for (const event of newEvents) {
        if (event.type === 'enter') {
          insideRef.current.add(event.zone.activityId)
        } else {
          insideRef.current.delete(event.zone.activityId)
        }
      }

      setInsideZones(new Set(insideRef.current))
      setEvents((prev) => [...prev, ...newEvents])
    }
  }, [location, zones])

  return { events, insideZones }
}
