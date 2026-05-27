'use client'

import { loadStripe } from '@stripe/stripe-js'
import type { Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

export function getStripeClient(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = process.env['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'] ?? ''
    stripePromise = loadStripe(key)
  }
  return stripePromise
}
