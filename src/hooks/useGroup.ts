'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type {
  TripMemberRow,
  GroupMessageRow,
  GroupExpenseRow,
  ActivityVoteRow,
} from '@/types/database'

interface GroupState {
  members: TripMemberRow[]
  messages: GroupMessageRow[]
  votes: ActivityVoteRow[]
  expenses: GroupExpenseRow[]
  loading: boolean
  error: string | null
}

export function useGroup(tripId: string): GroupState & {
  sendMessage: (mensaje: string) => Promise<void>
  castVote: (activityId: string, voto: boolean) => Promise<void>
  addExpense: (concepto: string, monto: number) => Promise<void>
  updateLocation: (lat: number, lng: number) => Promise<void>
} {
  const [state, setState] = useState<GroupState>({
    members: [],
    messages: [],
    votes: [],
    expenses: [],
    loading: true,
    error: null,
  })

  // Initial data load
  useEffect(() => {
    if (!tripId) return

    const load = async () => {
      const [membersRes, messagesRes, votesRes, expensesRes] =
        await Promise.all([
          fetch(`/api/groups/${tripId}`),
          fetch(`/api/groups/${tripId}/messages`),
          fetch(`/api/groups/${tripId}/votes`),
          fetch(`/api/groups/${tripId}/expenses`),
        ])

      const [membersData, messagesData, votesData, expensesData] =
        await Promise.all([
          membersRes.json() as Promise<{ members: TripMemberRow[] }>,
          messagesRes.json() as Promise<{ messages: GroupMessageRow[] }>,
          votesRes.json() as Promise<{ votes: ActivityVoteRow[] }>,
          expensesRes.json() as Promise<{ expenses: GroupExpenseRow[] }>,
        ])

      setState({
        members: membersData.members ?? [],
        messages: messagesData.messages ?? [],
        votes: votesData.votes ?? [],
        expenses: expensesData.expenses ?? [],
        loading: false,
        error: null,
      })
    }

    load().catch((err: unknown) => {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : 'Error cargando grupo',
      }))
    })
  }, [tripId])

  // Realtime subscriptions
  useEffect(() => {
    if (!tripId) return
    const supabase = createClient()

    const channel = supabase
      .channel(`group:${tripId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trip_members',
          filter: `trip_id=eq.${tripId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setState((s) => ({
              ...s,
              members: [...s.members, payload.new as TripMemberRow],
            }))
          } else if (payload.eventType === 'UPDATE') {
            setState((s) => ({
              ...s,
              members: s.members.map((m) =>
                m.id === (payload.new as TripMemberRow).id
                  ? (payload.new as TripMemberRow)
                  : m
              ),
            }))
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_messages',
          filter: `trip_id=eq.${tripId}`,
        },
        (payload) => {
          setState((s) => ({
            ...s,
            messages: [...s.messages, payload.new as GroupMessageRow],
          }))
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_votes',
          filter: `trip_id=eq.${tripId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setState((s) => ({
              ...s,
              votes: [...s.votes, payload.new as ActivityVoteRow],
            }))
          } else if (payload.eventType === 'UPDATE') {
            setState((s) => ({
              ...s,
              votes: s.votes.map((v) =>
                v.id === (payload.new as ActivityVoteRow).id
                  ? (payload.new as ActivityVoteRow)
                  : v
              ),
            }))
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_expenses',
          filter: `trip_id=eq.${tripId}`,
        },
        (payload) => {
          setState((s) => ({
            ...s,
            expenses: [...s.expenses, payload.new as GroupExpenseRow],
          }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [tripId])

  const sendMessage = useCallback(
    async (mensaje: string) => {
      await fetch(`/api/groups/${tripId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje }),
      })
    },
    [tripId]
  )

  const castVote = useCallback(
    async (activityId: string, voto: boolean) => {
      await fetch(`/api/groups/${tripId}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity_id: activityId, voto }),
      })
    },
    [tripId]
  )

  const addExpense = useCallback(
    async (concepto: string, monto: number) => {
      await fetch(`/api/groups/${tripId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concepto, monto }),
      })
    },
    [tripId]
  )

  const updateLocation = useCallback(
    async (lat: number, lng: number) => {
      await fetch(`/api/groups/${tripId}/location`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng }),
      })
    },
    [tripId]
  )

  return { ...state, sendMessage, castVote, addExpense, updateLocation }
}
