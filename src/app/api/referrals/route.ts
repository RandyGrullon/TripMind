import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOrCreateReferralCode, applyReferral } from '@/lib/referrals'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const code = await getOrCreateReferralCode(user.id)
  return NextResponse.json({ code })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as { code: unknown }
  const code = typeof body.code === 'string' ? body.code : null
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 })
  }

  const ok = await applyReferral(code, user.id)
  return NextResponse.json({ ok })
}
