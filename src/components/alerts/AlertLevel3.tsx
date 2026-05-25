import type { Alert } from '@/types/alerts'

interface AlertLevel3Props {
  alert: Alert
  onDismiss?: () => void
}

export function AlertLevel3({ alert, onDismiss }: AlertLevel3Props) {
  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-yellow-800">{alert.title}</p>
          <p className="mt-1 text-yellow-700">{alert.message}</p>
        </div>
        {onDismiss ? (
          <button
            onClick={onDismiss}
            className="text-yellow-500 hover:text-yellow-700"
          >
            &times;
          </button>
        ) : null}
      </div>
    </div>
  )
}
