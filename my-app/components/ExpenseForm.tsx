"use client"

import type React from "react"

import { useState } from "react"
import { useExpenses } from "@/contexts/ExpenseContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"


export interface Expense {
  id: string
  date: string
  amount: number
  category: string
  description: string
  paymentMode?: "Cash" | "Online"
}

export default function ExpenseForm() {
  const { addExpense } = useExpenses()
  const [date, setDate] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [paymentMode, setPaymentMode] = useState<"Cash" | "Online">("Cash")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !amount || !category || !description) {
      toast.error("Please fill in all fields", {
        description: "Missing fields",
      })
      return
    }

    const parsedAmount = Number.parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid positive amount", {
        description: "Invalid amount",
      })
      return
    }

    addExpense({
      date,
      amount: parsedAmount,
      category,
      description,
      })

    toast.success("Your expense has been recorded successfully", {
      description: "Expense added",
    })

    // Reset form
    setDate("")
    setAmount("")
    setCategory("")
    setDescription("")
    setPaymentMode("Cash")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium">
            Date
          </label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Amount
          </label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <Input
            id="category"
            placeholder="e.g., Food, Transport"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Input
            id="description"
            placeholder="e.g., Grocery shopping"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Add payment mode selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Payment Mode</label>
        <RadioGroup
          value={paymentMode}
          onValueChange={(value) => setPaymentMode(value as "Cash" | "Online")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Cash" id="cash" />
            <Label htmlFor="cash">Cash</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Online" id="online" />
            <Label htmlFor="online">Online</Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full">
        Add Expense
      </Button>
    </form>
  )
}

// This code defines a form for adding expenses. It includes fields for date, amount, category, description, and payment mode.