import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const ExpenseSchema = z.object({
  concepto: z.string().min(1),
  monto: z.number().positive(),
  entre_todos: z.boolean().default(true),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('group_expenses')
    .select('*')
    .eq('trip_id', id)
    .order('created_at', { ascending: true })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ expenses: data })
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
  const parsed = ExpenseSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const nombre =
    (user.user_metadata['full_name'] as string | undefined) ??
    user.email ??
    'Viajero'

  const { data, error } = await supabase
    .from('group_expenses')
    .insert({
      trip_id: id,
      pagado_por: user.id,
      nombre_pagador: nombre,
      concepto: parsed.data.concepto,
      monto: parsed.data.monto,
      entre_todos: parsed.data.entre_todos,
    })
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ expense: data })
}
