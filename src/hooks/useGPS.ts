import { useState, useEffect, useCallback } from 'react'
import type { UserLocation } from '@/types/geofencing'

interface GPSState {
  location: UserLocation | null
  error: string | null
  watching: boolean
}

export function useGPS(): GPSState & {
  startWatching: () => void
  stopWatching: () => void
} {
  const [state, setState] = useState<GPSState>({
    location: null,
    error: null,
    watching: false,
  })
  const [watchId, setWatchId] = useState<number | null>(null)

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'Geolocation not supported' }))
      return
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          },
          error: null,
          watching: true,
        })
      },
      (err) => {
        setState((s) => ({ ...s, error: err.message }))
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    )

    setWatchId(id)
    setState((s) => ({ ...s, watching: true }))
  }, [])

  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
    setState((s) => ({ ...s, watching: false }))
  }, [watchId])

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  return { ...state, startWatching, stopWatching }
}
