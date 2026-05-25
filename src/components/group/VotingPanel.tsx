'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface VoteOption {
  id: string
  label: string
  votes: number
}

interface VotingPanelProps {
  question: string
  options: VoteOption[]
  onVote: (optionId: string) => void
}

export function VotingPanel({ question, options, onVote }: VotingPanelProps) {
  const [voted, setVoted] = useState<string | null>(null)
  const total = options.reduce((sum, o) => sum + o.votes, 0)

  const handleVote = (id: string) => {
    if (voted) return
    setVoted(id)
    onVote(id)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="font-semibold text-gray-900 mb-3">{question}</p>
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const pct = total > 0 ? Math.round((option.votes / total) * 100) : 0
          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={voted !== null}
              className="relative rounded-lg border border-gray-200 p-3 text-left overflow-hidden hover:border-blue-300 disabled:cursor-default"
            >
              <div
                className="absolute inset-0 bg-blue-50 transition-all"
                style={{ width: `${pct}%` }}
              />
              <div className="relative flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {option.label}
                </span>
                <span className="text-sm text-gray-500">{pct}%</span>
              </div>
            </button>
          )
        })}
      </div>
      {voted ? (
        <p className="mt-3 text-xs text-green-600">Vote recorded!</p>
      ) : null}
      <Button
        variant="ghost"
        size="sm"
        className="mt-3"
        onClick={() => setVoted(null)}
        disabled={!voted}
      >
        Change vote
      </Button>
    </div>
  )
}
