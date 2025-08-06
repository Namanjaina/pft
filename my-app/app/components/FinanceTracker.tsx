"use client"

import ExpenseForm from "./ExpenseForm"
import ExpenseList from "./ExpenseList"
import ExpenseSummary from "./ExpenseSummary"
import ReceiptScanner from "./ReceiptScanner"
import { useExpenses } from "../contexts/ExpenseContext"
import { useState } from "react"

// Update the Expense interface to include paymentMode
export interface Expense {
  id: string
  date: string
  amount: number
  category: string
  description: string
  paymentMode: "Cash" | "Online" // Add this new field
}

export default function FinanceTracker() {
  const { expenses, clearExpenses, clearExpensesByDate } = useExpenses()
  const [selectedDate, setSelectedDate] = useState<string>("")

  const handleClearByDate = () => {
    if (selectedDate) {
      clearExpensesByDate(selectedDate)
      setSelectedDate("")
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-white/10">
        <ExpenseForm />
      </div>
      <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-white/10">
        <ExpenseList expenses={expenses} />
        {expenses.length > 0 && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex-1 p-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Date to Clear</option>
                {Array.from(new Set(expenses.map((expense) => expense.date)))
                  .sort()
                  .reverse()
                  .map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
              </select>
              {selectedDate && (
                <button
                  onClick={handleClearByDate}
                  className="px-4 py-3 bg-red-600/80 text-white rounded-lg hover:bg-red-700/80 backdrop-blur-sm"
                >
                  Clear Selected Date
                </button>
              )}
            </div>
            <button
              onClick={clearExpenses}
              className="w-full px-4 py-3 bg-red-600/80 text-white rounded-lg hover:bg-red-700/80 backdrop-blur-sm"
            >
              Clear All Expenses
            </button>
          </div>
        )}
      </div>
      <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-white/10">
        <ReceiptScanner />
      </div>
      <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-white/10">
        <ExpenseSummary expenses={expenses} />
      </div>
    </div>
  )
}

