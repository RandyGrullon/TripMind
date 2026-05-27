'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { PlanTier } from '@/types/subscription'

interface ProState {
  tier: PlanTier
  loading: boolean
}

export function usePro(): ProState {
  const [state, setState] = useState<ProState>({ tier: 'free', loading: true })

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setState({ tier: 'free', loading: false })
        return
      }

      const { data } = await supabase
        .from('subscriptions')
        .select('tier, status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      const tier: PlanTier =
        data?.tier === 'grupo' ? 'grupo' : data?.tier === 'pro' ? 'pro' : 'free'

      setState({ tier, loading: false })
    }

    void load()
  }, [])

  return state
}
