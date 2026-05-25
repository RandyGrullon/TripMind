import type { DayItinerary } from '@/types/activity'
import { formatCurrency } from '@/lib/utils/formatters'

interface BudgetDisplayProps {
  itinerary: DayItinerary[]
  currency?: string
  totalBudget: number
}

export function BudgetDisplay({
  itinerary,
  currency = 'USD',
  totalBudget,
}: BudgetDisplayProps) {
  const spent = itinerary
    .flatMap((d) => d.activities)
    .reduce((sum, a) => sum + a.cost, 0)

  const remaining = totalBudget - spent
  const percentage = Math.min((spent / totalBudget) * 100, 100)

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Spent: {formatCurrency(spent, currency)}</span>
        <span>Budget: {formatCurrency(totalBudget, currency)}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className={`h-2 rounded-full transition-all ${remaining < 0 ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p
        className={`mt-2 text-sm font-medium ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}
      >
        {remaining >= 0
          ? `${formatCurrency(remaining, currency)} remaining`
          : `${formatCurrency(-remaining, currency)} over budget`}
      </p>
    </div>
  )
}
