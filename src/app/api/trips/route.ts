import { createClient } from '@/lib/supabase/server'
import type { Trip } from '@/types/trip'

export async function POST(request: Request): Promise<Response> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'No autenticado' }, { status: 401 })
  }

  const body = (await request.json()) as { trip: Trip }

  const { data, error } = await supabase
    .from('trips')
    .insert({
      user_id: user.id,
      data: body.trip,
      paquete: body.trip.paquete,
      grupo_link: crypto.randomUUID(),
      estado: 'planificando',
      actividades_pendientes: [],
    })
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ trip: data })
}

export async function GET(): Promise<Response> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ trips: data })
}
