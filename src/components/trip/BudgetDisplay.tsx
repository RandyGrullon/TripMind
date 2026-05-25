import type { Day } from '@/types/trip'
import { formatCurrency } from '@/lib/utils/formatters'

interface BudgetDisplayProps {
  dias: Day[]
  currency?: string
  totalBudget: number
}

export function BudgetDisplay({
  dias,
  currency = 'USD',
  totalBudget,
}: BudgetDisplayProps) {
  const spent = dias
    .flatMap((d) => d.actividades)
    .reduce((sum, a) => sum + a.precioEstimado, 0)

  const remaining = totalBudget - spent
  const percentage = Math.min((spent / totalBudget) * 100, 100)

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Gastado: {formatCurrency(spent, currency)}</span>
        <span>Presupuesto: {formatCurrency(totalBudget, currency)}</span>
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
          ? `${formatCurrency(remaining, currency)} restante`
          : `${formatCurrency(-remaining, currency)} sobre presupuesto`}
      </p>
    </div>
  )
}
