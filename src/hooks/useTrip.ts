import { useState, useCallback } from 'react'
import type { Trip } from '@/types/trip'

interface TripState {
  trip: Trip | null
  loading: boolean
  error: string | null
}

export function useTrip(tripId: string): TripState & {
  loadTrip: () => Promise<void>
} {
  const [state, setState] = useState<TripState>({
    trip: null,
    loading: false,
    error: null,
  })

  const loadTrip = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))

    try {
      const res = await fetch(`/api/trips/${tripId}`)
      if (!res.ok) throw new Error(`Failed to load trip: ${res.status}`)
      const data = (await res.json()) as { trip: Trip }
      setState({
        trip: data.trip,
        loading: false,
        error: null,
      })
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }))
    }
  }, [tripId])

  return { ...state, loadTrip }
}
