import type { DayItinerary } from '@/types/activity'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils/dateHelpers'
import { ActivityItem } from './ActivityItem'

interface ItineraryCardProps {
  day: DayItinerary
}

export function ItineraryCard({ day }: ItineraryCardProps) {
  return (
    <Card variant="bordered">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Day {day.dayIndex + 1}
        </h3>
        <span className="text-sm text-gray-500">{formatDate(day.date)}</span>
      </div>
      <div className="flex flex-col gap-3">
        {day.activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </Card>
  )
}
