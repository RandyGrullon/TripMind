import { formatCurrency } from '@/lib/utils/formatters'
import type { User } from '@/types/user'

interface Expense {
  id: string
  description: string
  amount: number
  currency: string
  paidBy: string
  splitAmong: string[]
}

interface ExpenseSplitProps {
  expenses: Expense[]
  members: User[]
}

export function ExpenseSplit({ expenses, members }: ExpenseSplitProps) {
  const memberMap = new Map(members.map((m) => [m.id, m.name]))

  const balances = new Map<string, number>()
  for (const member of members) balances.set(member.id, 0)

  for (const expense of expenses) {
    const share = expense.amount / expense.splitAmong.length
    balances.set(
      expense.paidBy,
      (balances.get(expense.paidBy) ?? 0) + expense.amount
    )
    for (const userId of expense.splitAmong) {
      balances.set(userId, (balances.get(userId) ?? 0) - share)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
          >
            <span className="text-gray-700">{expense.description}</span>
            <span className="font-medium">
              {formatCurrency(expense.amount, expense.currency)}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t pt-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Balances</p>
        {Array.from(balances.entries()).map(([userId, balance]) => (
          <div key={userId} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {memberMap.get(userId) ?? userId}
            </span>
            <span className={balance >= 0 ? 'text-green-600' : 'text-red-600'}>
              {balance >= 0 ? '+' : ''}
              {formatCurrency(balance, 'USD')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
