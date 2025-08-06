"use client"

import type React from "react"

import { useState } from "react"
import { useExpenses } from "../contexts/ExpenseContext"

export default function ExpenseForm() {
  const { addExpense } = useExpenses()
  const [date, setDate] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [paymentMode, setPaymentMode] = useState<"Cash" | "Online">("Cash") // Add this new state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedAmount = Number.parseFloat(amount)
    if (parsedAmount <= 0) {
      alert("Please enter a positive amount.")
      return
    }
    addExpense({
      date,
      amount: parsedAmount,
      category,
      description,
      paymentMode, // Include the payment mode in the expense
    })
    setDate("")
    setAmount("")
    setCategory("")
    setDescription("")
    setPaymentMode("Cash") // Reset to default
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Add Expense</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (₹)"
          min="0.01"
          step="0.01"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Add the payment mode selection */}
      <div className="flex items-center space-x-4">
        <label className="font-medium">Payment Mode:</label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMode"
              value="Cash"
              checked={paymentMode === "Cash"}
              onChange={() => setPaymentMode("Cash")}
              className="form-radio h-4 w-4 text-green-500"
            />
            <span>Cash</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMode"
              value="Online"
              checked={paymentMode === "Online"}
              onChange={() => setPaymentMode("Online")}
              className="form-radio h-4 w-4 text-blue-500"
            />
            <span>Online</span>
          </label>
        </div>
      </div>

      <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
        Add Expense
      </button>
    </form>
  )
}

