"use client"

import { useEffect, useRef } from "react"
import { useExpenses } from "@/contexts/ExpenseContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Chart, registerables } from "chart.js"
import { Download, PieChart, BarChart, TrendingUp } from "lucide-react"

Chart.register(...registerables)

export default function ExpenseReports() {
  const { expenses, getExpensesByCategory } = useExpenses()
  const pieChartRef = useRef<HTMLCanvasElement>(null)
  const barChartRef = useRef<HTMLCanvasElement>(null)
  const lineChartRef = useRef<HTMLCanvasElement>(null)
  const pieChartInstance = useRef<Chart | null>(null)
  const barChartInstance = useRef<Chart | null>(null)
  const lineChartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!expenses.length) return

    // Category distribution chart (Pie)
    if (pieChartRef.current) {
      const expensesByCategory = getExpensesByCategory()
      const categories = Object.keys(expensesByCategory)
      const amounts = Object.values(expensesByCategory)

      if (pieChartInstance.current) {
        pieChartInstance.current.destroy()
      }

      const ctx = pieChartRef.current.getContext("2d")
      if (!ctx) return

      pieChartInstance.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: categories,
          datasets: [
            {
              data: amounts,
              backgroundColor: [
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 99, 132, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
              ],
              borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || ""
                  const value = context.parsed || 0
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                  const percentage = Math.round((value / total) * 100)
                  return `${label}: ${formatCurrency(value)} (${percentage}%)`
                },
              },
            },
          },
        },
      })
    }

    // Monthly expenses chart (Bar)
    if (barChartRef.current) {
      // Group expenses by month
      const expensesByMonth: Record<string, number> = {}

      expenses.forEach((expense) => {
        const date = new Date(expense.date)
        const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

        if (!expensesByMonth[monthYear]) {
          expensesByMonth[monthYear] = 0
        }

        expensesByMonth[monthYear] += expense.amount
      })

      // Sort months chronologically
      const sortedMonths = Object.keys(expensesByMonth).sort((a, b) => {
        const dateA = new Date(a)
        const dateB = new Date(b)
        return dateA.getTime() - dateB.getTime()
      })

      const monthlyAmounts = sortedMonths.map((month) => expensesByMonth[month])

      if (barChartInstance.current) {
        barChartInstance.current.destroy()
      }

      const ctx = barChartRef.current.getContext("2d")
      if (!ctx) return

      barChartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: sortedMonths,
          datasets: [
            {
              label: "Monthly Expenses",
              data: monthlyAmounts,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => formatCurrency(Number(value)),
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => formatCurrency(context.parsed.y),
              },
            },
          },
        },
      })
    }

    // Expense trend chart (Line)
    if (lineChartRef.current) {
      // Create cumulative expenses over time
      const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      const dates: string[] = []
      const cumulativeAmounts: number[] = []
      let runningTotal = 0

      sortedExpenses.forEach((expense) => {
        runningTotal += expense.amount
        dates.push(expense.date)
        cumulativeAmounts.push(runningTotal)
      })

      if (lineChartInstance.current) {
        lineChartInstance.current.destroy()
      }

      const ctx = lineChartRef.current.getContext("2d")
      if (!ctx) return

      lineChartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: dates,
          datasets: [
            {
              label: "Cumulative Expenses",
              data: cumulativeAmounts,
              fill: false,
              borderColor: "rgba(75, 192, 192, 1)",
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => formatCurrency(Number(value)),
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => formatCurrency(context.parsed.y),
              },
            },
          },
        },
      })
    }

    return () => {
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy()
      }
      if (barChartInstance.current) {
        barChartInstance.current.destroy()
      }
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy()
      }
    }
  }, [expenses, getExpensesByCategory])

  const handleExportReport = () => {
    // In a real application, this would generate a PDF report
    // For this demo, we'll just show an alert
    alert("Report exported successfully!")
  }

  if (!expenses.length) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Expense Reports</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          No expenses recorded yet. Add some expenses to see your reports.
        </p>
        <Button onClick={() => (window.location.href = "/expenses")}>Add Expenses</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Expense Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize your spending patterns and track your financial progress.
          </p>
        </div>
        <Button onClick={handleExportReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>How your expenses are distributed across categories</CardDescription>
            </div>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <canvas ref={pieChartRef}></canvas>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Monthly Expenses</CardTitle>
              <CardDescription>Your spending patterns month by month</CardDescription>
            </div>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <canvas ref={barChartRef}></canvas>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Expense Trend</CardTitle>
              <CardDescription>Cumulative expenses over time</CardDescription>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <canvas ref={lineChartRef}></canvas>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

