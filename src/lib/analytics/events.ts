'use client'

import posthog from 'posthog-js'

export function track(
  event: AnalyticsEvent,
  properties?: Record<string, unknown>
): void {
  posthog.capture(event, properties)
}

export type AnalyticsEvent =
  | 'trip_generated'
  | 'trip_shared'
  | 'booking_click'
  | 'pro_paywall_shown'
  | 'pro_converted'
  | 'alert_shown'
  | 'alert_accepted'
  | 'activity_completed'
  | 'activity_lost'
  | 'activity_rescheduled'
  | 'tiktok_analyzed'
  | 'referral_created'
  | 'referral_converted'
