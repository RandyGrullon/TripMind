import type { Alert } from '@/types/alerts'

interface AlertLevel1Props {
  alert: Alert
  onDismiss?: () => void
}

export function AlertLevel1({ alert, onDismiss }: AlertLevel1Props) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-blue-800">{alert.title}</p>
          <p className="text-blue-700">{alert.message}</p>
        </div>
        {onDismiss ? (
          <button
            onClick={onDismiss}
            className="text-blue-500 hover:text-blue-700"
          >
            &times;
          </button>
        ) : null}
      </div>
    </div>
  )
}
