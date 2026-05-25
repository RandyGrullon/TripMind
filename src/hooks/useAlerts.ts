import { useState, useCallback } from 'react'
import type { Alert } from '@/types/alerts'

export function useAlerts(): {
  alerts: Alert[]
  addAlert: (alert: Alert) => void
  acknowledgeAlert: (id: string) => void
  clearAlerts: () => void
} {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const addAlert = useCallback((alert: Alert) => {
    setAlerts((prev) => [alert, ...prev])
  }, [])

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    )
  }, [])

  const clearAlerts = useCallback(() => {
    setAlerts([])
  }, [])

  return { alerts, addAlert, acknowledgeAlert, clearAlerts }
}
