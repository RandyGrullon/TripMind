'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface ChatMessage {
  id: string
  userId: string
  userName: string
  text: string
  timestamp: number
}

interface GroupChatProps {
  messages: ChatMessage[]
  currentUserId: string
  onSend: (text: string) => void
}

export function GroupChat({ messages, currentUserId, onSend }: GroupChatProps) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    onSend(trimmed)
    setInput('')
  }

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 p-4">
        {messages.map((msg) => {
          const isOwn = msg.userId === currentUserId
          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-xl px-3 py-2 text-sm ${isOwn ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}
              >
                {!isOwn ? (
                  <p className="text-xs font-medium mb-1 opacity-70">
                    {msg.userName}
                  </p>
                ) : null}
                <p>{msg.text}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex gap-2 border-t p-3">
        <Input
          id="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend()
          }}
          className="flex-1"
        />
        <Button onClick={handleSend} size="sm">
          Send
        </Button>
      </div>
    </div>
  )
}
