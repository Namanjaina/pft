import type { Expense } from "./FinanceTracker"

interface ExpenseSummaryProps {
  expenses: Expense[]
}

export default function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Expense Summary</h2>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-lg font-semibold">Total Expenses</p>
          <p className="text-2xl text-blue-600">₹{totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-lg font-semibold">Number of Expenses</p>
          <p className="text-2xl text-blue-600">{expenses.length}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-lg font-semibold">Average Expense</p>
          <p className="text-2xl text-blue-600">₹{averageExpense.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

