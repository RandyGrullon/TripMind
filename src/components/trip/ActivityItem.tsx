import type { Activity } from '@/types/activity'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils/formatters'

interface ActivityItemProps {
  activity: Activity
  onSelect?: (activity: Activity) => void
}

export function ActivityItem({ activity, onSelect }: ActivityItemProps) {
  return (
    <button
      onClick={() => onSelect?.(activity)}
      className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-50"
    >
      <div className="flex flex-col items-center text-xs text-gray-500 min-w-[48px]">
        <span>{activity.startTime}</span>
        <span className="text-gray-300">|</span>
        <span>{activity.endTime}</span>
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{activity.title}</p>
        <p className="text-sm text-gray-500">{activity.location.name}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Badge variant="info">{activity.category}</Badge>
        <span className="text-sm font-medium text-gray-700">
          {formatCurrency(activity.cost, activity.currency)}
        </span>
      </div>
    </button>
  )
}
