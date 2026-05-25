import type { Alert } from '@/types/alerts'
import { Button } from '@/components/ui/Button'

interface AlertLevel5CruiseProps {
  alert: Alert
  onDismiss?: () => void
  onAction?: (actionType: string) => void
}

export function AlertLevel5Cruise({
  alert,
  onDismiss,
  onAction,
}: AlertLevel5CruiseProps) {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl bg-purple-600 p-5 text-white shadow-xl sm:left-auto sm:right-4 sm:w-96">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-purple-200">
            On-Site Alert
          </p>
          <p className="mt-1 text-lg font-bold">{alert.title}</p>
          <p className="mt-1 text-sm text-purple-100">{alert.message}</p>
          {alert.actions ? (
            <div className="mt-4 flex gap-2 flex-wrap">
              {alert.actions.map((action) => (
                <Button
                  key={action.type}
                  size="sm"
                  variant="secondary"
                  onClick={() => onAction?.(action.type)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
        {onDismiss ? (
          <button
            onClick={onDismiss}
            className="text-purple-200 hover:text-white"
          >
            &times;
          </button>
        ) : null}
      </div>
    </div>
  )
}
