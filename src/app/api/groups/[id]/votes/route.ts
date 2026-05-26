import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const VoteSchema = z.object({
  activity_id: z.string().min(1),
  voto: z.boolean(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params
  const supabase = await createClient()

  const activityId = new URL(request.url).searchParams.get('activityId')

  let query = supabase.from('activity_votes').select('*').eq('trip_id', id)
  if (activityId) query = query.eq('activity_id', activityId)

  const { data, error } = await query
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ votes: data })
}

export async function POST(
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
  const parsed = VoteSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('activity_votes')
    .upsert(
      {
        trip_id: id,
        activity_id: parsed.data.activity_id,
        user_id: user.id,
        voto: parsed.data.voto,
      },
      { onConflict: 'trip_id,activity_id,user_id' }
    )
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ vote: data })
}
