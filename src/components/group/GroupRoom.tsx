'use client'

import type { User } from '@/types/user'

interface GroupRoomProps {
  groupId: string
  members: User[]
}

export function GroupRoom({ groupId: _, members }: GroupRoomProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1"
          >
            <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold">
              {member.name[0]}
            </div>
            <span className="text-sm text-gray-700">{member.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
