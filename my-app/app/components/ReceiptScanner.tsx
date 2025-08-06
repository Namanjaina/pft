"use client"

import type React from "react"

import { useState } from "react"
import { createWorker } from "tesseract.js"
import { useExpenses } from "../contexts/ExpenseContext"

type ReceiptScannerProps = {}

export default function ReceiptScanner() {
  const { addExpense } = useExpenses()
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState("")

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    setScanResult("")

    const worker = await createWorker("eng")

    try {
      // Use a library like opencv.js for edge detection (not implemented here)
      // const edgeDetectedImage = await detectEdges(file)

      const {
        data: { text },
      } = await worker.recognize(file)
      setScanResult(text)

      // Parse all information from the receipt
      const parsedData = parseReceiptData(text)

      // Store all receipt data in the database
      await storeReceiptData(parsedData)

      // Add expense based on parsed data
      addExpense({
        date: parsedData.date || new Date().toISOString().split("T")[0],
        amount: parsedData.totalAmount || 0,
        category: "Scanned Receipt",
        description: parsedData.merchantName || "Scanned receipt (please review)",
        paymentMode: "Cash", // Default payment mode
      })
    } catch (error) {
      console.error("OCR Error:", error)
      setScanResult("Error scanning receipt. Please try again.")
    } finally {
      await worker.terminate()
      setIsScanning(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Scan Receipt</h2>
      <input type="file" accept="image/*" onChange={handleScan} disabled={isScanning} className="mb-2" />
      {isScanning && <p className="text-blue-600">Scanning...</p>}
      {scanResult && (
        <div className="mt-2 p-2 border rounded">
          <h3 className="font-semibold">Scan Result:</h3>
          <pre className="whitespace-pre-wrap text-sm">{scanResult}</pre>
        </div>
      )}
    </div>
  )
}

function parseReceiptData(text: string) {
  // Implement more robust parsing logic here
  const dateMatch = text.match(/Date:?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i)
  const totalMatch = text.match(/Total:?\s*₹?(\d+(\.\d{2})?)/i)
  const merchantMatch = text.match(/([A-Z][a-z]+ ?(Inc\.|LLC|Ltd\.?|Limited|Corporation))/i)

  return {
    date: dateMatch ? dateMatch[1] : null,
    totalAmount: totalMatch ? Number.parseFloat(totalMatch[1]) : null,
    merchantName: merchantMatch ? merchantMatch[1] : null,
    fullText: text,
  }
}

async function storeReceiptData(data: any) {
  // Implement database storage logic here
  // For example, using fetch to send data to an API endpoint
  try {
    const response = await fetch("/api/store-receipt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to store receipt data")
    }
  } catch (error) {
    console.error("Error storing receipt data:", error)
  }
}

