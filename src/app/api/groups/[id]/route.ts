import { createClient } from '@/lib/supabase/server'

// GET — list members of a group trip
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('trip_members')
    .select('*')
    .eq('trip_id', id)
    .order('joined_at', { ascending: true })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ members: data })
}

// POST — join a group trip
export async function POST(
  _request: Request,
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

  // Verify the trip exists via grupo_link
  const { data: tripRow, error: tripError } = await supabase
    .from('trips')
    .select('id')
    .eq('grupo_link', id)
    .single()

  if (tripError || !tripRow) {
    return Response.json({ error: 'Grupo no encontrado' }, { status: 404 })
  }

  const nombre =
    (user.user_metadata['full_name'] as string | undefined) ??
    user.email ??
    'Viajero'

  const { data, error } = await supabase
    .from('trip_members')
    .upsert(
      {
        trip_id: tripRow.id,
        user_id: user.id,
        nombre,
        avatar_url:
          (user.user_metadata['avatar_url'] as string | undefined) ?? null,
      },
      { onConflict: 'trip_id,user_id' }
    )
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ member: data, tripId: tripRow.id })
}
