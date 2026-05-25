import type { Alert } from '@/types/alerts'

interface AlertLevel2Props {
  alert: Alert
  onDismiss?: () => void
}

export function AlertLevel2({ alert, onDismiss }: AlertLevel2Props) {
  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-green-800">{alert.title}</p>
          <p className="text-green-700">{alert.message}</p>
        </div>
        {onDismiss ? (
          <button
            onClick={onDismiss}
            className="text-green-500 hover:text-green-700"
          >
            &times;
          </button>
        ) : null}
      </div>
    </div>
  )
}
