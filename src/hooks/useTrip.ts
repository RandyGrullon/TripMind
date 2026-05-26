'use client'

import { useState, useCallback } from 'react'
import type { Trip } from '@/types/trip'
import type { Activity } from '@/types/activity'
import type { TripRow } from '@/types/database'

interface TripState {
  trip: Trip | null
  tripId: string | null
  grupoLink: string | null
  actividadesPendientes: Activity[]
  loading: boolean
  error: string | null
}

export function useTrip(id: string): TripState & {
  loadTrip: () => Promise<void>
  markActivityLost: (activityId: string) => Promise<void>
  rescheduleActivity: (
    activityId: string,
    reason: string
  ) => Promise<Activity | null>
  acceptReschedule: (original: Activity, updated: Activity) => Promise<void>
} {
  const [state, setState] = useState<TripState>({
    trip: null,
    tripId: null,
    grupoLink: null,
    actividadesPendientes: [],
    loading: false,
    error: null,
  })

  const loadTrip = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const res = await fetch(`/api/trips/${id}`)
      if (!res.ok) throw new Error(`Error cargando viaje: ${res.status}`)
      const { trip: row } = (await res.json()) as { trip: TripRow }
      setState({
        trip: row.data,
        tripId: row.id,
        grupoLink: row.grupo_link,
        actividadesPendientes: row.actividades_pendientes,
        loading: false,
        error: null,
      })
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : 'Error desconocido',
      }))
    }
  }, [id])

  const markActivityLost = useCallback(async (activityId: string) => {
    setState((s) => {
      if (!s.trip) return s
      const dias = s.trip.dias.map((day) => ({
        ...day,
        actividades: day.actividades.map((act) =>
          act.id === activityId
            ? { ...act, estado: 'perdida' as const, esPerdida: true }
            : act
        ),
      }))
      const lostAct = s.trip.dias
        .flatMap((d) => d.actividades)
        .find((a) => a.id === activityId)
      const pendientes = lostAct
        ? [...s.actividadesPendientes, lostAct]
        : s.actividadesPendientes

      const updatedTrip = { ...s.trip, dias }

      // Persist to DB asynchronously
      if (s.tripId) {
        fetch(`/api/trips/${s.tripId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: updatedTrip,
            actividades_pendientes: pendientes,
          }),
        })
      }

      return { ...s, trip: updatedTrip, actividadesPendientes: pendientes }
    })
  }, [])

  const rescheduleActivity = useCallback(
    async (activityId: string, reason: string): Promise<Activity | null> => {
      const { tripId } = state
      if (!tripId) return null
      try {
        const res = await fetch('/api/reschedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activityId, tripId, reason }),
        })
        if (!res.ok) return null
        const { activity } = (await res.json()) as { activity: Activity }
        return activity
      } catch {
        return null
      }
    },
    [state]
  )

  const acceptReschedule = useCallback(
    async (original: Activity, updated: Activity) => {
      setState((s) => {
        if (!s.trip) return s
        const dias = s.trip.dias.map((day) => ({
          ...day,
          actividades: day.actividades.map((act) => {
            if (act.id !== original.id) return act
            const base = {
              ...updated,
              id: original.id,
              estado: 'pendiente' as const,
              esPerdida: false,
            }
            if (original.reagendadaDesdeDia !== undefined) {
              return {
                ...base,
                reagendadaDesdeDia: original.reagendadaDesdeDia,
              }
            }
            return base
          }),
        }))
        const pendientes = s.actividadesPendientes.filter(
          (a) => a.id !== original.id
        )
        const updatedTrip = { ...s.trip, dias }

        if (s.tripId) {
          fetch(`/api/trips/${s.tripId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              data: updatedTrip,
              actividades_pendientes: pendientes,
            }),
          })
        }

        return { ...s, trip: updatedTrip, actividadesPendientes: pendientes }
      })
    },
    []
  )

  return {
    ...state,
    loadTrip,
    markActivityLost,
    rescheduleActivity,
    acceptReschedule,
  }
}
