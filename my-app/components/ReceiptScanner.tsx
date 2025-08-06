"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useExpenses } from "@/contexts/ExpenseContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Scan, Upload, Check, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export default function ReceiptScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [scannedData, setScannedData] = useState<{
    amount: string
    date: string
    merchant: string
    category: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addExpense } = useExpenses()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setScannedData(null)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const scanReceipt = async () => {
    if (!previewUrl) return

    setIsScanning(true)
    toast.info("Please wait while we process your receipt.", {
      
    })

    try {
      // In a real application, you would send the image to a server for OCR processing
      // or use a client-side OCR library. For this demo, we'll simulate the process.
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate extracted data
      const mockData = {
        amount: (Math.random() * 100 + 10).toFixed(2),
        date: new Date().toISOString().split("T")[0],
        merchant: ["Grocery Store", "Restaurant", "Gas Station", "Department Store"][Math.floor(Math.random() * 4)],
        category: ["Food", "Transportation", "Shopping", "Utilities"][Math.floor(Math.random() * 4)],
      }

      setScannedData(mockData)

      toast.success("We've extracted the information from your receipt.", {
        
      })
    } catch (error) {
      toast.error("There was an error processing your receipt. Please try again.", {
        
      })
    } finally {
      setIsScanning(false)
    }
  }

  const addToExpenses = () => {
    if (!scannedData) return

    try {
      addExpense({
        date: scannedData.date,
        amount: Number.parseFloat(scannedData.amount),
        category: scannedData.category,
        description: `${scannedData.merchant} (scanned receipt)`,
      })

      toast.success("The receipt has been added to your expenses.")

      // Reset the form
      setPreviewUrl(null)
      setScannedData(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (error) {
      toast.error("There was a problem adding this expense. Please try again.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Scan className="h-5 w-5 mr-2" />
          Scan Receipt
        </CardTitle>
        <CardDescription>Upload a receipt image to automatically extract expense information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          {!previewUrl ? (
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={triggerFileInput}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click to upload a receipt image or drag and drop
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Supports JPG, PNG, HEIC</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                <Image src={previewUrl || "/placeholder.svg"} alt="Receipt preview" fill className="object-contain" />
              </div>

              {!scannedData ? (
                <Button onClick={scanReceipt} className="w-full" disabled={isScanning}>
                  {isScanning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Scan className="mr-2 h-4 w-4" />
                      Scan Receipt
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Amount</label>
                      <p className="font-medium">₹{scannedData.amount}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Date</label>
                      <p className="font-medium">{scannedData.date}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Merchant</label>
                      <p className="font-medium">{scannedData.merchant}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Category</label>
                      <p className="font-medium">{scannedData.category}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={addToExpenses} className="flex-1">
                      <Check className="mr-2 h-4 w-4" />
                      Add to Expenses
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPreviewUrl(null)
                        setScannedData(null)
                        if (fileInputRef.current) fileInputRef.current.value = ""
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

