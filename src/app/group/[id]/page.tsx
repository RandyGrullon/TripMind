'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { GroupRoom } from '@/components/group/GroupRoom'
import { TripMap } from '@/components/map/TripMap'
import { useUser } from '@/hooks/useUser'
import type { Trip } from '@/types/trip'
import type { TripRow } from '@/types/database'

export default function GroupPage() {
  const params = useParams()
  const grupoLink = params['id'] as string
  const router = useRouter()

  const { user, loading: userLoading } = useUser()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [tripId, setTripId] = useState<string | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userLoading) return
    if (!user) {
      router.push(`/login?redirect=/group/${grupoLink}`)
      return
    }

    const joinAndLoad = async () => {
      try {
        // Join the group (upsert member)
        const joinRes = await fetch(`/api/groups/${grupoLink}`, {
          method: 'POST',
        })
        if (!joinRes.ok) {
          const { error: joinErr } = (await joinRes.json()) as { error: string }
          throw new Error(joinErr)
        }
        const { tripId: tid } = (await joinRes.json()) as { tripId: string }
        setTripId(tid)

        // Load trip data
        const tripRes = await fetch(`/api/trips/${tid}`)
        if (!tripRes.ok) throw new Error('No se pudo cargar el viaje')
        const { trip: row } = (await tripRes.json()) as { trip: TripRow }
        setTrip(row.data)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error al unirte al grupo'
        )
      } finally {
        setPageLoading(false)
      }
    }

    joinAndLoad()
  }, [user, userLoading, grupoLink, router])

  if (userLoading || pageLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Cargando sala grupal...</p>
      </main>
    )
  }

  if (error || !trip || !tripId || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-red-600">{error ?? 'Error al cargar el grupo'}</p>
          <Link
            href="/"
            className="mt-4 block text-sm text-blue-600 hover:underline"
          >
            ← Volver al inicio
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{trip.destino}</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Sala grupal · {trip.personas} viajero
            {trip.personas !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Map with group */}
        <div className="mb-6 h-64 overflow-hidden rounded-xl shadow-sm">
          <TripMap dias={trip.dias} />
        </div>

        {/* Group room */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <GroupRoom tripId={tripId} trip={trip} currentUser={user} />
        </div>
      </div>
    </main>
  )
}
