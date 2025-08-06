import type { Expense } from "./FinanceTracker"

interface ExpenseListProps {
  expenses: Expense[]
}

export default function ExpenseList({ expenses }: ExpenseListProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Expense List</h2>
      {expenses.length === 0 ? (
        <p className="text-gray-500">No expenses added yet.</p>
      ) : (
        <ul className="space-y-2 max-h-96 overflow-y-auto">
          {expenses.map((expense) => (
            <li key={expense.id} className="bg-gray-100 p-4 rounded">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{expense.date}</span>
                <span className="text-green-600 font-bold">₹{expense.amount.toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                <span className="font-medium">{expense.category}</span> - <span>{expense.description}</span>
                {/* Add payment mode badge */}
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    expense.paymentMode === "Cash" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {expense.paymentMode}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

