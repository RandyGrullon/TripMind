import type { Alert } from '@/types/alerts'
import { Button } from '@/components/ui/Button'

interface AlertLevel4Props {
  alert: Alert
  onDismiss?: () => void
  onAction?: (actionType: string) => void
}

export function AlertLevel4({ alert, onDismiss, onAction }: AlertLevel4Props) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="font-bold text-red-800">{alert.title}</p>
          <p className="mt-1 text-red-700">{alert.message}</p>
          {alert.actions ? (
            <div className="mt-3 flex gap-2 flex-wrap">
              {alert.actions.map((action) => (
                <Button
                  key={action.type}
                  size="sm"
                  variant="primary"
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
            className="text-red-500 hover:text-red-700"
          >
            &times;
          </button>
        ) : null}
      </div>
    </div>
  )
}
