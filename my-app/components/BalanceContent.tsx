"use client"

import type React from "react"

import { useState } from "react"
import { useExpenses } from "@/contexts/ExpenseContext"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LinkIcon, ArrowRight, BanknoteIcon, DollarSign, RefreshCw } from "lucide-react"
import Image from "next/image"

export default function BalanceContent() {
  const [accountNumber, setAccountNumber] = useState("")
  const [bankName, setBankName] = useState("")
  const [isLinking, setIsLinking] = useState(false)
  const [isLinked, setIsLinked] = useState(false)
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<any[]>([])
  const { addExpense } = useExpenses()

  const handleLinkAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLinking(true)

    // Simulate API call to link bank account
    toast.info("Please wait while we connect to your bank.", {
      description: "Linking account...",
    })

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful account linking
      toast.success("Your bank account has been connected to Finance Tracker.", {
        description: "Account linked successfully!",
      })

      // Set mock balance
      setBalance(24586.75)

      // Simulate importing transactions
      const mockTransactions = [
        {
          id: 1,
          date: new Date().toISOString().split("T")[0],
          amount: 1250.0,
          type: "credit",
          category: "Salary",
          description: "Monthly salary",
        },
        {
          id: 2,
          date: new Date().toISOString().split("T")[0],
          amount: 450.5,
          type: "debit",
          category: "Groceries",
          description: "Supermarket",
        },
        {
          id: 3,
          date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
          amount: 120.99,
          type: "debit",
          category: "Entertainment",
          description: "Movie tickets",
        },
        {
          id: 4,
          date: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0],
          amount: 350.0,
          type: "debit",
          category: "Dining",
          description: "Restaurant dinner",
        },
        {
          id: 5,
          date: new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0],
          amount: 500.0,
          type: "debit",
          category: "Rent",
          description: "Monthly rent payment",
        },
        {
          id: 6,
          date: new Date(Date.now() - 86400000 * 4).toISOString().split("T")[0],
          amount: 60.0,
          type: "debit",
          category: "Utilities",
          description: "Electricity bill",
        },
      ]

      setTransactions(mockTransactions)
      setIsLinked(true)

      // Add transactions to expenses
      mockTransactions.forEach((transaction) => {
        if (transaction.type === "debit") {
          addExpense({
            date: transaction.date,
            amount: transaction.amount,
            category: transaction.category,
            description: transaction.description,
          })
        }
      })

      toast.success(`${mockTransactions.length} transactions have been imported to your account.`, {
        description: "Transactions imported",
      })
    } catch (error) {
      toast.error("There was a problem connecting to your bank. Please try again.", {
        description: "Error linking account",
      })
    } finally {
      setIsLinking(false)
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Image - FIXED CHANGED TO ABSOLUTE */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white-900/50 to-gray-900/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto p-4">
        <div className="bg-black/60 backdrop-blur-sm p-6 rounded-lg mb-8">
          <h1 className="text-3xl font-bold text-white">Check Balance</h1>
          <p className="text-gray-300 mt-2">Link your bank account to import transactions and check your balance</p>
        </div>

        {!isLinked ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/60 backdrop-blur-sm p-6 rounded-lg shadow-xl">
              <div className="flex items-center mb-6">
                <BanknoteIcon className="h-8 w-8 text-blue-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Link Your Bank Account</h2>
              </div>

              <form onSubmit={handleLinkAccount} className="space-y-4">
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-300 mb-1">
                    Bank Name
                  </label>
                  <Input
                    id="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Enter your bank name"
                    className="bg-black/10 border-white/20 text-white placeholder-blue-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-300 mb-1">
                    Account Number
                  </label>
                  <Input
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter your account number"
                    className="bg-black/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLinking}
                >
                  {isLinking ? (
                    <>Linking Account...</>
                  ) : (
                    <>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Link Account
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div className="bg-black/60 backdrop-blur-sm p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Benefits of Linking</h2>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                  <span>Automatically import transactions from your bank</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                  <span>Track your spending patterns and identify areas to save</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                  <span>Get real-time updates on your account balance</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                  <span>Categorize transactions automatically</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                  <span>Set up alerts for unusual spending</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-black/50 rounded-lg border border-white/10">
                <p className="text-gray-300 text-sm">
                  Your security is our priority. We use bank-level encryption to protect your data and never store your
                  login credentials.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-black/60 backdrop-blur-sm border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg">Current Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-white">{formatCurrency(balance)}</span>
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-gray-400">
                  Last updated: {new Date().toLocaleTimeString()}
                </CardFooter>
              </Card>

              <Card className="bg-black/60 backdrop-blur-sm border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg">Bank Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white">Bank:</span>
                      <span className="text-white font-medium">{bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Account:</span>
                      <span className="text-white font-medium">XXXX{accountNumber.slice(-4)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full text-black border-white/20 hover:bg-white/10">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-black/60 backdrop-blur-sm border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="text-black border-white/20 hover:bg-white/10">
                      View Statement
                    </Button>
                    <Button variant="outline" size="sm" className="text-black border-white/20 hover:bg-white/10">
                      Transfer Money
                    </Button>
                    <Button variant="outline" size="sm" className="text-black border-white/20 hover:bg-white/10">
                      Pay Bills
                    </Button>
                    <Button variant="outline" size="sm" className="text-black border-white/20 hover:bg-white/10">
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/60 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Transactions</CardTitle>
                <CardDescription className="text-gray-400">Your latest bank transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === "credit" ? "bg-green-500/20" : "bg-red-500/20"
                          }`}
                        >
                          {transaction.type === "credit" ? (
                            <ArrowRight className="h-5 w-5 text-green-400" />
                          ) : (
                            <ArrowRight className="h-5 w-5 text-red-400 transform rotate-180" />
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-white font-medium">{transaction.description}</p>
                          <p className="text-gray-400 text-sm">
                            {transaction.category} • {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <div className={`font-bold ${transaction.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                        {transaction.type === "credit" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full text-black border-white/20 hover:bg-white/10">
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

