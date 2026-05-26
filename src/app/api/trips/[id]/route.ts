import { createClient } from '@/lib/supabase/server'
import type { Activity } from '@/types/activity'
import type { Trip } from '@/types/trip'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return Response.json({ error: 'Viaje no encontrado' }, { status: 404 })
  }

  return Response.json({ trip: data })
}

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

  const body = (await request.json()) as {
    data?: Trip
    estado?: string
    actividades_pendientes?: Activity[]
  }

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (body.data !== undefined) update['data'] = body.data
  if (body.estado !== undefined) update['estado'] = body.estado
  if (body.actividades_pendientes !== undefined)
    update['actividades_pendientes'] = body.actividades_pendientes

  const { data, error } = await supabase
    .from('trips')
    .update(update)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ trip: data })
}
