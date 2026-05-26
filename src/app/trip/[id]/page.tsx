'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { TripMap } from '@/components/map/TripMap'
import { ActivityItem } from '@/components/trip/ActivityItem'
import { BudgetDisplay } from '@/components/trip/BudgetDisplay'
import { useTrip } from '@/hooks/useTrip'
import { useGPS } from '@/hooks/useGPS'
import { signOut } from '@/lib/auth/actions'
import type { Activity } from '@/types/activity'

export default function TripPage() {
  const params = useParams()
  const tripId = params['id'] as string

  const {
    trip,
    grupoLink,
    actividadesPendientes,
    loading,
    error,
    loadTrip,
    markActivityLost,
    rescheduleActivity,
    acceptReschedule,
  } = useTrip(tripId)

  const { location, startWatching, stopWatching, watching } = useGPS()
  const [rescheduleTarget, setRescheduleTarget] = useState<Activity | null>(
    null
  )
  const [rescheduleResult, setRescheduleResult] = useState<Activity | null>(
    null
  )
  const [rescheduleLoading, setRescheduleLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadTrip()
  }, [loadTrip])

  const handleMarkLost = async (activity: Activity) => {
    await markActivityLost(activity.id)
    setRescheduleTarget(activity)
  }

  const handleReschedule = async () => {
    if (!rescheduleTarget) return
    setRescheduleLoading(true)
    const result = await rescheduleActivity(
      rescheduleTarget.id,
      'El usuario la perdió o no pudo asistir'
    )
    setRescheduleResult(result)
    setRescheduleLoading(false)
  }

  const handleAcceptReschedule = async () => {
    if (!rescheduleTarget || !rescheduleResult) return
    await acceptReschedule(rescheduleTarget, rescheduleResult)
    setRescheduleTarget(null)
    setRescheduleResult(null)
  }

  const handleCopyGroupLink = () => {
    if (!grupoLink) return
    const url = `${window.location.origin}/group/${grupoLink}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-3 h-2 w-48 overflow-hidden rounded-full bg-blue-200 mx-auto">
            <div className="h-2 w-1/2 animate-pulse rounded-full bg-blue-600" />
          </div>
          <p className="text-sm text-gray-500">Cargando viaje...</p>
        </div>
      </main>
    )
  }

  if (error || !trip) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-red-600">{error ?? 'Viaje no encontrado'}</p>
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
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{trip.destino}</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              {trip.personas} persona{trip.personas !== 1 ? 's' : ''} ·{' '}
              {trip.fechaInicio} → {trip.fechaFin} ·{' '}
              <span className="capitalize">{trip.paquete}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {grupoLink ? (
              <button
                onClick={handleCopyGroupLink}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                {copied ? '¡Copiado!' : 'Compartir grupo'}
              </button>
            ) : null}
            <button
              onClick={() => (watching ? stopWatching() : startWatching())}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                watching
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {watching ? '📍 GPS activo' : 'GPS off'}
            </button>
            <form action={signOut}>
              <button
                type="submit"
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Salir
              </button>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="mb-6 h-72 overflow-hidden rounded-xl shadow-sm">
          <TripMap
            dias={trip.dias}
            {...(location
              ? {
                  userLocation: {
                    lat: location.lat,
                    lng: location.lng,
                    accuracy: location.accuracy,
                    timestamp: location.timestamp,
                  },
                }
              : {})}
          />
        </div>

        {/* Reagendamiento modal */}
        {rescheduleTarget ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="mb-2 font-semibold text-amber-800">
              Actividad perdida: {rescheduleTarget.nombre}
            </p>
            {rescheduleResult ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-700">
                  La IA sugiere reagendar para:{' '}
                  <strong>
                    {rescheduleResult.horaInicio} – {rescheduleResult.horaFin}
                  </strong>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleAcceptReschedule}
                    className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => {
                      setRescheduleTarget(null)
                      setRescheduleResult(null)
                    }}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Descartar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleReschedule}
                  disabled={rescheduleLoading}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {rescheduleLoading ? 'Buscando...' : 'Buscar nueva hora'}
                </button>
                <button
                  onClick={() => setRescheduleTarget(null)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Guardar como perdida
                </button>
              </div>
            )}
          </div>
        ) : null}

        {/* Pending activities */}
        {actividadesPendientes.length > 0 ? (
          <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-2 text-sm font-semibold text-gray-700">
              Actividades pendientes para tu próxima visita
            </p>
            <ul className="list-disc pl-4 text-sm text-gray-500">
              {actividadesPendientes.map((a) => (
                <li key={a.id}>{a.nombre}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Budget */}
        <div className="mb-4">
          <BudgetDisplay dias={trip.dias} totalBudget={trip.presupuestoTotal} />
        </div>

        {/* Summary */}
        <p className="mb-6 text-gray-600">{trip.resumenViaje}</p>

        {/* Warnings */}
        {trip.advertencias.length > 0 ? (
          <div className="mb-4 rounded-lg bg-amber-50 p-4">
            <p className="mb-2 font-medium text-amber-800">Advertencias</p>
            <ul className="list-disc pl-4 text-sm text-amber-700">
              {trip.advertencias.map((adv, i) => (
                <li key={i}>{adv}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Days */}
        <div className="flex flex-col gap-4">
          {trip.dias.map((dia) => (
            <div key={dia.numero} className="rounded-xl bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Día {dia.numero}: {dia.titulo}
                  </h2>
                  <p className="text-xs text-gray-400">{dia.ciudad}</p>
                </div>
                <span className="text-sm font-medium text-gray-500">
                  ${dia.presupuestoDia}
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {dia.actividades.map((act) => (
                  <div key={act.id} className="px-2">
                    <ActivityItem
                      activity={act}
                      {...(act.estado !== 'perdida'
                        ? { onSelect: handleMarkLost }
                        : {})}
                    />
                    {act.estado === 'perdida' ? (
                      <p className="pb-2 pl-[60px] text-xs font-medium text-red-500">
                        Actividad perdida
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        {trip.consejos.length > 0 ? (
          <div className="mt-4 rounded-lg bg-blue-50 p-4">
            <p className="mb-2 font-medium text-blue-800">Consejos</p>
            <ul className="list-disc pl-4 text-sm text-blue-700">
              {trip.consejos.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </main>
  )
}
