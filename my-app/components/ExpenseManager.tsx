"use client"

import { useState, useRef } from "react"
import { useExpenses, type Expense } from "@/contexts/ExpenseContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ExpenseList from "./ExpenseList"
import { formatCurrency } from "@/lib/utils"
import { Filter, FileText, FileDown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import jsPDF from "jspdf"
import "jspdf-autotable"


export default function ExpenseManager() {
  const { expenses, getExpensesByDate } = useExpenses()
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(expenses)
  const { toast } = useToast()
  const expenseListRef = useRef<HTMLDivElement>(null)

  const handleFilter = () => {
    const filtered = getExpensesByDate(startDate, endDate)
    setFilteredExpenses(filtered)
  }

  const handleReset = () => {
    setStartDate("")
    setEndDate("")
    setFilteredExpenses(expenses)
  }

  const exportToCSV = () => {
    const expensesToExport = filteredExpenses.length > 0 ? filteredExpenses : expenses

    if (expensesToExport.length === 0) {
      toast({
        title: "No expenses to export",
        description: "Add some expenses before exporting.",
        variant: "destructive",
      })
      return
    }

    // Create CSV content
    const headers = ["Date", "Category", "Description", "Amount"]
    const csvContent = [
      headers.join(","),
      ...expensesToExport.map((expense) =>
        [expense.date, expense.category, `"${expense.description.replace(/"/g, '""')}"`, expense.amount].join(","),
      ),
    ].join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `expenses_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "CSV Exported",
      description: "Your expenses have been exported as a CSV file.",
    })
  }

  const exportToPDF = async () => {
    const expensesToExport = filteredExpenses.length > 0 ? filteredExpenses : expenses

    if (expensesToExport.length === 0) {
      toast({
        title: "No expenses to export",
        description: "Add some expenses before exporting.",
        variant: "destructive",
      })
      return
    }

    try {
      // Create a new PDF document
      const doc = new jsPDF()
      console.log(typeof doc.autotable);
      // Add title
      doc.setFontSize(18)
      doc.text("Expense Report", 14, 15)

      // Add date range if filtered
      if (startDate || endDate) {
        doc.setFontSize(12)
        doc.text(`Date Range: ${startDate || "All"} to ${endDate || "All"}`, 14, 25)
      }

      // Add total
      const total = expensesToExport.reduce((sum, expense) => sum + expense.amount, 0)
      doc.setFontSize(14)
      doc.text(`Total: ${formatCurrency(total)}`, 14, 35)

      // Create table
      const tableColumn = ["Date", "Category", "Description", "Amount"]
      const tableRows = expensesToExport.map((expense) => [
        expense.date,
        expense.category,
        expense.description,
        formatCurrency(expense.amount),
      ])

      // Add table to document
    
      // doc.autotable(doc, {
      //   head: [tableColumn],
      //   body: tableRows,
      //   startY: 45,
      //   styles: { fontSize: 10 },
      //   theme: "grid",
      // });

      // Save the PDF
      doc.save(`expense_report_${new Date().toISOString().split("T")[0]}.pdf`)

      toast({
        title: "PDF Exported",
        description: "Your expenses have been exported as a PDF file.",
      })
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export expenses as PDF. Please try again.",
       
      })
    }
  }

  const totalAmount = (filteredExpenses.length > 0 ? filteredExpenses : expenses).reduce(
    (sum, expense) => sum + expense.amount,
    0,
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Expense Manager</h1>
        <p className="text-gray-600 dark:text-gray-400">Add, view, and manage all your expenses in one place.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>All Expenses</CardTitle>
                <CardDescription>View and manage all your recorded expenses</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={exportToPDF}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by date</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="startDate" className="text-sm font-medium">
                    Start Date
                  </label>
                  <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="endDate" className="text-sm font-medium">
                    End Date
                  </label>
                  <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleFilter} className="w-full">
                    Apply Filter
                  </Button>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={handleReset} className="w-full">
                    Reset
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium">Total:</span>
                <span className="text-lg font-bold">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <div ref={expenseListRef}>
             
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}