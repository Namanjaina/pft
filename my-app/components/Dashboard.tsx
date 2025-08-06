"use client"

import { useExpenses } from "@/contexts/ExpenseContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import ExpenseForm from "./ExpenseForm"
import ExpenseList from "./ExpenseList"
import ExpenseChart from "./ExpenseChart"
import ReceiptScanner from "./ReceiptScanner"
import { Wallet, TrendingUp, CreditCard, PieChart } from "lucide-react"

export default function Dashboard() {
  const { expenses, getTotalExpenses, getExpensesByCategory } = useExpenses()

  const totalExpenses = getTotalExpenses()
  const categories = Object.keys(getExpensesByCategory()).length
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to your financial dashboard. Track and manage your expenses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">{expenses.length} total transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageExpense)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories}</div>
            <p className="text-xs text-muted-foreground">Expense categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Latest Expense</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {expenses.length > 0 ? formatCurrency(expenses[expenses.length - 1].amount) : "₹0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              {expenses.length > 0 ? expenses[expenses.length - 1].category : "No expenses yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
            <CardDescription>Record your expenses to keep track of your spending</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your most recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseList limit={5} />
          </CardContent>
        </Card>
      </div>

      {/* Add the Receipt Scanner component before the Expense Chart */}
      <ReceiptScanner />

      <ExpenseChart />
    </div>
  )
}

