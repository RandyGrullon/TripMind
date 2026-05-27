import Stripe from 'stripe'
import { requireEnv } from '@/lib/utils/env'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'), {
      apiVersion: '2026-04-22.dahlia',
      typescript: true,
    })
  }
  return _stripe
}

export function getStripePriceId(env: string): string {
  return requireEnv(env)
}
