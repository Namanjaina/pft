"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"

export type Expense = {
  id: string
  date: string
  amount: number
  category: string
  description: string
}

type ExpenseContextType = {
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, "id">) => void
  updateExpense: (id: string, expense: Omit<Expense, "id">) => void
  deleteExpense: (id: string) => void
  getExpensesByCategory: () => Record<string, number>
  getExpensesByDate: (startDate?: string, endDate?: string) => Expense[]
  getTotalExpenses: () => number
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Load expenses from localStorage
      const storedExpenses = localStorage.getItem(`expenses_${user.id}`)
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses))
      }
    } else {
      setExpenses([])
    }
  }, [user])

  const saveExpenses = (newExpenses: Expense[]) => {
    if (user) {
      localStorage.setItem(`expenses_${user.id}`, JSON.stringify(newExpenses))
    }
  }

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    }
    const newExpenses = [...expenses, newExpense]
    setExpenses(newExpenses)
    saveExpenses(newExpenses)
  }

  const updateExpense = (id: string, expense: Omit<Expense, "id">) => {
    const newExpenses = expenses.map((exp) => (exp.id === id ? { ...expense, id } : exp))
    setExpenses(newExpenses)
    saveExpenses(newExpenses)
  }

  const deleteExpense = (id: string) => {
    const newExpenses = expenses.filter((expense) => expense.id !== id)
    setExpenses(newExpenses)
    saveExpenses(newExpenses)
  }

  const getExpensesByCategory = () => {
    return expenses.reduce(
      (acc, expense) => {
        const { category, amount } = expense
        acc[category] = (acc[category] || 0) + amount
        return acc
      },
      {} as Record<string, number>,
    )
  }

  const getExpensesByDate = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) return expenses

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      const start = startDate ? new Date(startDate) : new Date(0)
      const end = endDate ? new Date(endDate) : new Date()

      return expenseDate >= start && expenseDate <= end
    })
  }

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0)
  }

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpensesByCategory,
        getExpensesByDate,
        getTotalExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpenses() {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider")
  }
  return context
}

