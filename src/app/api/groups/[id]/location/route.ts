import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const LocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'No autenticado' }, { status: 401 })
  }

  const body: unknown = await request.json()
  const parsed = LocationSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { error } = await supabase
    .from('trip_members')
    .update({
      lat_actual: parsed.data.lat,
      lng_actual: parsed.data.lng,
      ultima_ubicacion: new Date().toISOString(),
    })
    .eq('trip_id', id)
    .eq('user_id', user.id)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ ok: true })
}
