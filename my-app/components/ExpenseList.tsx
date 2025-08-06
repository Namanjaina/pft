"use client"

import { useExpenses } from "@/contexts/ExpenseContext"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Trash2, CreditCard, Banknote } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"


interface ExpenseListProps {
  limit?: number
}

// Define the Expense type
interface Expense {
  id: string
  category: string
  date: string
  description: string
  amount: number
  paymentMode?: "Cash" | "Online" // Make paymentMode optional if some expenses may not have it
}

export default function ExpenseList({ limit }: ExpenseListProps) {
  const { expenses, deleteExpense } = useExpenses()

  const displayExpenses = limit ? expenses.slice(-limit).reverse() : [...expenses].reverse()

  const handleDelete = (id: string) => {
    deleteExpense(id)
    toast.success("The expense has been removed successfully", {
      description: "Expense deleted",
    })
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No expenses recorded yet.</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Add your first expense to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {displayExpenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{expense.category}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(expense.date)}</span>

              {/* Add payment mode badge */}
              

            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{expense.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold">{formatCurrency(expense.amount)}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(expense.id)}
              className="h-8 w-8 text-gray-500 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

