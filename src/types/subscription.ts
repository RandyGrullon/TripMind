export type PlanId =
  | 'pro_mensual'
  | 'pro_anual'
  | 'pro_por_viaje'
  | 'pro_grupo'
  | 'free'

export type PlanTier = 'free' | 'pro' | 'grupo'

export interface Subscription {
  id: string
  userId: string
  planId: PlanId
  tier: PlanTier
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  stripePriceId: string | null
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  createdAt: string
}

export interface SubscriptionRow {
  id: string
  user_id: string
  plan_id: PlanId
  tier: PlanTier
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  status: Subscription['status']
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
}
