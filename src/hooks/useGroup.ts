import { useState, useCallback } from 'react'
import type { User } from '@/types/user'

interface GroupState {
  members: User[]
  loading: boolean
  error: string | null
}

export function useGroup(groupId: string): GroupState & {
  loadGroup: () => Promise<void>
} {
  const [state, setState] = useState<GroupState>({
    members: [],
    loading: false,
    error: null,
  })

  const loadGroup = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))

    try {
      const res = await fetch(`/api/groups/${groupId}`)
      if (!res.ok) throw new Error(`Failed to load group: ${res.status}`)
      const data = (await res.json()) as { members: User[] }
      setState({ members: data.members, loading: false, error: null })
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }))
    }
  }, [groupId])

  return { ...state, loadGroup }
}
