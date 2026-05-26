import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const MessageSchema = z.object({
  mensaje: z.string().min(1).max(1000),
  tipo: z.enum(['mensaje', 'sistema', 'alerta']).default('mensaje'),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('group_messages')
    .select('*')
    .eq('trip_id', id)
    .order('created_at', { ascending: true })
    .limit(100)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ messages: data })
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
  const parsed = MessageSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const nombre =
    (user.user_metadata['full_name'] as string | undefined) ??
    user.email ??
    'Viajero'

  const { data, error } = await supabase
    .from('group_messages')
    .insert({
      trip_id: id,
      user_id: user.id,
      nombre_usuario: nombre,
      mensaje: parsed.data.mensaje,
      tipo: parsed.data.tipo,
    })
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ message: data })
}
