"use client"

import { useState } from "react"
import ExpenseList from "../components/ExpenseList"
import { useExpenses } from "../contexts/ExpenseContext"
import Image from "next/image"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

// Extend jsPDF type to include autotable
declare module "jspdf" {
  interface jsPDF {
    autotable: typeof autoTable;
  }
}

export default function History() {
  const { expenses, clearExpenses, clearExpensesByDate } = useExpenses()
  const [selectedDate, setSelectedDate] = useState<string>("")

  const filteredExpenses = selectedDate ? expenses.filter((expense) => expense.date === selectedDate) : expenses

  const uniqueDates = Array.from(new Set(expenses.map((expense) => expense.date)))
    .sort()
    .reverse()

  const handleClearByDate = () => {
    if (selectedDate) {
      clearExpensesByDate(selectedDate)
      setSelectedDate("")
    }
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    const tableColumn = ["Date", "Amount", "Category", "Description"]
    const tableRows = filteredExpenses.map((expense) => [
      expense.date,
      `₹${expense.amount.toFixed(2)}`,
      expense.category,
      expense.description,
    ])

    doc.autotable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    })

    doc.text("Expense Report", 14, 15)
    doc.save(`expense_report_${selectedDate || "all_dates"}.pdf`)
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-02-19%20at%2011.59.44_139104d6.jpg-RSLaaM9Xkku2ozOOx9vHRqPrEZs8Df.jpeg"
          alt="Finance Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto p-4">
        <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg mb-8">
          <h1 className="text-3xl font-bold text-white">Expense History</h1>
          <p className="text-gray-300 mt-2">View and manage your past expenses</p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg shadow-xl">
          <div className="mb-4 flex items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {selectedDate && (
              <button
                onClick={handleClearByDate}
                className="px-4 py-3 bg-red-600/80 text-white rounded-lg hover:bg-red-700/80 backdrop-blur-sm"
              >
                Clear Selected Date
              </button>
            )}
          </div>

          <ExpenseList expenses={filteredExpenses} />

          {filteredExpenses.length > 0 && (
            <div className="mt-4 space-y-4">
              <button
                onClick={downloadPDF}
                className="w-full px-4 py-3 bg-blue-600/80 text-white rounded-lg hover:bg-blue-700/80 backdrop-blur-sm"
              >
                Download PDF Report
              </button>
              <button
                onClick={clearExpenses}
                className="w-full px-4 py-3 bg-red-600/80 text-white rounded-lg hover:bg-red-700/80 backdrop-blur-sm"
              >
                Clear All Expenses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

