import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import { requireEnv } from '@/lib/utils/env'

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  const customerId = sub?.stripe_customer_id as string | null
  if (!customerId) {
    return NextResponse.json(
      { error: 'No active subscription' },
      { status: 404 }
    )
  }

  const stripe = getStripe()
  const baseUrl = requireEnv('NEXT_PUBLIC_BASE_URL')

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${baseUrl}/dashboard`,
  })

  return NextResponse.json({ url: portalSession.url })
}
