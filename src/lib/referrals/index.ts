import { createClient } from '@/lib/supabase/server'
import { trackServerEvent } from '@/lib/analytics/posthog'

function generateCode(userId: string): string {
  const base = userId.replace(/-/g, '').slice(0, 8).toUpperCase()
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `${base}${suffix}`
}

export interface ReferralRow {
  id: string
  user_id: string
  code: string
  conversions: number
  created_at: string
}

export async function getOrCreateReferralCode(userId: string): Promise<string> {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('referrals')
    .select('code')
    .eq('user_id', userId)
    .single()

  if (existing) return existing.code as string

  const code = generateCode(userId)
  await supabase
    .from('referrals')
    .insert({ user_id: userId, code, conversions: 0 })
  trackServerEvent(userId, 'referral_created', { code })
  return code
}

export async function applyReferral(
  code: string,
  newUserId: string
): Promise<boolean> {
  const supabase = await createClient()

  const { data: referral } = await supabase
    .from('referrals')
    .select('id, user_id, conversions')
    .eq('code', code.toUpperCase())
    .single()

  if (!referral) return false

  await supabase
    .from('referrals')
    .update({ conversions: (referral.conversions as number) + 1 })
    .eq('id', referral.id)

  trackServerEvent(newUserId, 'referral_converted', {
    code,
    referrer: referral.user_id,
  })
  return true
}
