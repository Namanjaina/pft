"use client"

import type { Expense } from "./FinanceTracker"

interface ExpenseHistoryProps {
  expenses: Expense[]
  selectedDate: string
  onDateSelect: (date: string) => void
}

export default function ExpenseHistory({ expenses, selectedDate, onDateSelect }: ExpenseHistoryProps) {
  const uniqueDates = Array.from(new Set(expenses.map((expense) => expense.date)))
    .sort()
    .reverse()

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Expense History</h2>
      <select
        value={selectedDate}
        onChange={(e) => onDateSelect(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">All Dates</option>
        {uniqueDates.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>
    </div>
  )
}

