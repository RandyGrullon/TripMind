import type { GeofenceZone } from '@/types/geofencing'
import { ALERT_LEVEL_COLORS } from '@/constants/alertLevels'

interface GeofenceCircleProps {
  zone: GeofenceZone
  visible?: boolean
}

export function GeofenceCircle({ zone, visible = true }: GeofenceCircleProps) {
  if (!visible) return null

  const color = ALERT_LEVEL_COLORS[zone.alertLevel]

  return (
    <div
      style={{
        width: zone.radius * 2,
        height: zone.radius * 2,
        borderColor: color,
        backgroundColor: `${color}20`,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
    />
  )
}
