import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getStripe } from '@/lib/stripe/server'
import { requireEnv } from '@/lib/utils/env'
import { createClient } from '@/lib/supabase/server'
import { trackServerEvent } from '@/lib/analytics/posthog'
import type Stripe from 'stripe'
import type { PlanId, PlanTier } from '@/types/subscription'
import { PLANS } from '@/constants/pricing'

function planIdToTier(planId: PlanId): PlanTier {
  if (planId === 'pro_grupo') return 'grupo'
  if (planId === 'free') return 'free'
  return 'pro'
}

async function upsertSubscription(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  planId: PlanId,
  session: Stripe.Checkout.Session
) {
  const tier = planIdToTier(planId)
  const isOneTime = PLANS[planId as keyof typeof PLANS]?.periodo === 'único'

  await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      plan_id: planId,
      tier,
      stripe_customer_id: session.customer as string | null,
      stripe_subscription_id: isOneTime
        ? null
        : (session.subscription as string | null),
      stripe_price_id: session.line_items?.data[0]?.price?.id ?? null,
      status: 'active',
      current_period_end: isOneTime ? null : null,
      cancel_at_period_end: false,
    },
    { onConflict: 'user_id' }
  )
}

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature') ?? ''

  const webhookSecret = requireEnv('STRIPE_WEBHOOK_SECRET')
  const stripe = getStripe()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.['userId']
    const planId = session.metadata?.['planId'] as PlanId | undefined

    if (!userId || !planId) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    const supabase = await createClient()
    await upsertSubscription(supabase, userId, planId, session)
    trackServerEvent(userId, 'pro_converted', { planId })
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const supabase = await createClient()
    await supabase
      .from('subscriptions')
      .update({ status: 'canceled', tier: 'free', plan_id: 'free' })
      .eq('stripe_subscription_id', sub.id)
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const supabase = await createClient()
    await supabase
      .from('subscriptions')
      .update({
        status: sub.status as
          | 'active'
          | 'canceled'
          | 'past_due'
          | 'trialing'
          | 'incomplete',
        cancel_at_period_end: sub.cancel_at_period_end,
      })
      .eq('stripe_subscription_id', sub.id)
  }

  return NextResponse.json({ received: true })
}
