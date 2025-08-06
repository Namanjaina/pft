"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useExpenses } from "../contexts/ExpenseContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExpenseChart() {
  const { expenses } = useExpenses()

  const chartData = useMemo(() => {
    const categoryTotals = expenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total,
    }))
  }, [expenses])

  return (
    <Card className="w-full mt-6 bg-black/30 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Expense by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="category" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip
                contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "none", borderRadius: "4px" }}
                labelStyle={{ color: "#ffffff" }}
              />
              <Bar dataKey="total" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

