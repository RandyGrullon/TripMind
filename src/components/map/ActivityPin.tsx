import type { Activity } from '@/types/activity'

interface ActivityPinProps {
  activity: Activity
  active?: boolean
  onClick?: () => void
}

export function ActivityPin({
  activity,
  active = false,
  onClick,
}: ActivityPinProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold text-white transition-transform hover:scale-110 ${active ? 'border-white bg-blue-600 scale-125' : 'border-white bg-gray-600'}`}
      title={activity.nombre}
    >
      {activity.nombre[0]?.toUpperCase() ?? '?'}
    </button>
  )
}
