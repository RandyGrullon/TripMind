'use client'

import { useGPS } from '@/hooks/useGPS'
import { Button } from '@/components/ui/Button'

interface LiveTrackerProps {
  onLocationUpdate?: (lat: number, lng: number) => void
}

export function LiveTracker({ onLocationUpdate }: LiveTrackerProps) {
  const { location, error, watching, startWatching, stopWatching } = useGPS()

  const handleToggle = () => {
    if (watching) {
      stopWatching()
    } else {
      startWatching()
      if (location) onLocationUpdate?.(location.lat, location.lng)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant={watching ? 'danger' : 'primary'}
        size="sm"
        onClick={handleToggle}
      >
        {watching ? 'Stop GPS' : 'Start GPS'}
      </Button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {location ? (
        <p className="text-xs text-gray-500">
          {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
        </p>
      ) : null}
    </div>
  )
}
