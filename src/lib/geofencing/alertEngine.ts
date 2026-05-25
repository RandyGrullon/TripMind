import type {
  GeofenceZone,
  UserLocation,
  GeofenceEvent,
} from '@/types/geofencing'
import { isInsideZone } from './detector'

export function detectZoneEvents(
  location: UserLocation,
  zones: GeofenceZone[],
  previouslyInside: Set<string>
): GeofenceEvent[] {
  const events: GeofenceEvent[] = []

  for (const zone of zones) {
    const inside = isInsideZone(location, zone)
    const wasInside = previouslyInside.has(zone.activityId)

    if (inside && !wasInside) {
      events.push({
        type: 'enter',
        zone,
        timestamp: location.timestamp,
        userLocation: { lat: location.lat, lng: location.lng },
      })
    } else if (!inside && wasInside) {
      events.push({
        type: 'exit',
        zone,
        timestamp: location.timestamp,
        userLocation: { lat: location.lat, lng: location.lng },
      })
    }
  }

  return events
}
