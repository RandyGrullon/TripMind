import type { Day } from '@/types/trip'
import { Card } from '@/components/ui/Card'
import { ActivityItem } from './ActivityItem'

interface ItineraryCardProps {
  day: Day
}

export function ItineraryCard({ day }: ItineraryCardProps) {
  return (
    <Card variant="bordered">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Día {day.numero}: {day.titulo}
        </h3>
        <span className="text-sm text-gray-500">{day.ciudad}</span>
      </div>
      <div className="flex flex-col gap-3">
        {day.actividades.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </Card>
  )
}
