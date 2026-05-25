import type { DayItinerary } from '@/types/activity'
import { ActivityItem } from './ActivityItem'

interface DayTimelineProps {
  days: DayItinerary[]
  activeDay?: number
  onDayChange?: (dayIndex: number) => void
}

export function DayTimeline({
  days,
  activeDay = 0,
  onDayChange,
}: DayTimelineProps) {
  const currentDay = days[activeDay]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((day) => (
          <button
            key={day.dayIndex}
            onClick={() => onDayChange?.(day.dayIndex)}
            className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              day.dayIndex === activeDay
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Day {day.dayIndex + 1}
          </button>
        ))}
      </div>
      {currentDay ? (
        <div className="flex flex-col gap-2">
          {currentDay.activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
