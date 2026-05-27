import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import { PLANS } from '@/constants/pricing'
import type { PlanKey } from '@/constants/pricing'
import { requireEnv } from '@/lib/utils/env'

function getPriceId(planId: PlanKey): string {
  const envKey = PLANS[planId].stripePriceEnv
  return requireEnv(envKey)
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as { planId: unknown }
  const planId = body.planId as PlanKey
  if (!(planId in PLANS)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const plan = PLANS[planId]
  const stripe = getStripe()
  const baseUrl = requireEnv('NEXT_PUBLIC_BASE_URL')

  const mode = plan.periodo === 'único' ? 'payment' : 'subscription'

  const session = await stripe.checkout.sessions.create({
    mode,
    ...(user.email !== undefined ? { customer_email: user.email } : {}),
    client_reference_id: user.id,
    line_items: [{ price: getPriceId(planId), quantity: 1 }],
    success_url: `${baseUrl}/dashboard?upgrade=success`,
    cancel_url: `${baseUrl}/precios?upgrade=cancelled`,
    metadata: { userId: user.id, planId },
  })

  return NextResponse.json({ url: session.url })
}
