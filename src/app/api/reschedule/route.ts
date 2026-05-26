import { rescheduleActivity } from '@/lib/ai/rescheduleActivity'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { TripRow } from '@/types/database'

const Schema = z.object({
  activityId: z.string().min(1),
  tripId: z.string().uuid(),
  reason: z.string().min(1),
})

function buildAvailableSlots(trip: TripRow): string[] {
  const slots: string[] = []
  for (const day of trip.data.dias) {
    const occupied = day.actividades.map((a) => `${a.horaInicio}-${a.horaFin}`)
    // Suggest morning, afternoon, evening gaps not already occupied
    const candidates = [
      '07:00-09:00',
      '10:00-12:00',
      '15:00-17:00',
      '19:00-21:00',
    ]
    for (const c of candidates) {
      if (!occupied.includes(c)) {
        slots.push(`Día ${day.numero} (${day.titulo}) ${c}`)
      }
    }
  }
  return slots.slice(0, 8)
}

export async function POST(request: Request): Promise<Response> {
  const body: unknown = await request.json()
  const parsed = Schema.safeParse(body)

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: tripRow, error: tripError } = await supabase
    .from('trips')
    .select('*')
    .eq('id', parsed.data.tripId)
    .single()

  if (tripError || !tripRow) {
    return Response.json({ error: 'Viaje no encontrado' }, { status: 404 })
  }

  const row = tripRow as TripRow
  const activity = row.data.dias
    .flatMap((d) => d.actividades)
    .find((a) => a.id === parsed.data.activityId)

  if (!activity) {
    return Response.json({ error: 'Actividad no encontrada' }, { status: 404 })
  }

  const availableSlots = buildAvailableSlots(row)
  if (availableSlots.length === 0) {
    return Response.json({ error: 'No hay slots disponibles' }, { status: 422 })
  }

  const updated = await rescheduleActivity(
    activity,
    parsed.data.reason,
    availableSlots
  )

  return Response.json({ activity: updated, availableSlots })
}
