'use client'

import { useCallback, useState } from 'react'
import { usePro } from './usePro'
import { track } from '@/lib/analytics/events'

export type PaywallTrigger = 'alert_ia' | 'trip_limit' | 'offline_mode'

interface PaywallState {
  open: boolean
  trigger: PaywallTrigger | null
  triggerMessage: string
}

interface UsePaywallReturn {
  paywallOpen: boolean
  triggerMessage: string
  checkPro: (trigger: PaywallTrigger) => boolean
  closePaywall: () => void
}

const TRIGGER_MESSAGES: Record<PaywallTrigger, string> = {
  alert_ia:
    '¡Tu viaje tiene un retraso crítico! Activa Pro para obtener el análisis de IA y la mejor solución.',
  trip_limit:
    'Has llegado al límite de viajes gratuitos. Pasa a Pro para viajes ilimitados.',
  offline_mode:
    'El modo sin conexión es exclusivo de Pro. Viaja tranquilo sin internet.',
}

export function usePaywall(): UsePaywallReturn {
  const { tier } = usePro()
  const [state, setState] = useState<PaywallState>({
    open: false,
    trigger: null,
    triggerMessage: '',
  })

  const checkPro = useCallback(
    (trigger: PaywallTrigger): boolean => {
      if (tier !== 'free') return true

      track('pro_paywall_shown', { trigger })
      setState({
        open: true,
        trigger,
        triggerMessage: TRIGGER_MESSAGES[trigger],
      })
      return false
    },
    [tier]
  )

  const closePaywall = useCallback(() => {
    setState({ open: false, trigger: null, triggerMessage: '' })
  }, [])

  return {
    paywallOpen: state.open,
    triggerMessage: state.triggerMessage,
    checkPro,
    closePaywall,
  }
}
