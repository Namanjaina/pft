"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"

const predefinedResponses = {
  hello: "Hello! How can I assist you with your finances today?",
  "add expense":
    "To add an expense, use the 'Add Expense' form on the main page. Fill in the date, amount, category, and description.",
  "view history": "You can view your expense history by clicking on the 'History' link in the navigation bar.",
  "clear expenses":
    "To clear expenses, go to the main page or history page. You can clear all expenses or select a specific date to clear.",
  help: "I can help you with adding expenses, viewing history, clearing expenses, and general finance tracking. What would you like to know more about?",
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([])
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { text: input, isUser: true }
    setMessages((prev) => [...prev, userMessage])

    const lowerInput = input.toLowerCase()
    let botResponse = "I'm sorry, I don't have information about that. Can you try asking something else?"

    for (const [key, value] of Object.entries(predefinedResponses)) {
      if (lowerInput.includes(key)) {
        botResponse = value
        break
      }
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: botResponse, isUser: false }])
    }, 500)

    setInput("")
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-2xl w-96 mb-4 border border-white/20">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-aFZ6s2RyiGlZAYEUCRMoqfGYKLmzcB.png"
              alt="Chatbot"
              width={30}
              height={30}
              className="mr-2"
            />
            <h3 className="font-bold">Finance Assistant</h3>
          </div>
          <div className="h-96 overflow-y-auto p-4 bg-gray-900/50">
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.isUser ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block p-3 rounded-lg ${
                    message.isUser ? "bg-blue-600 text-white" : "bg-white/10 text-white"
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </form>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-aFZ6s2RyiGlZAYEUCRMoqfGYKLmzcB.png"
          alt="Chatbot"
          width={40}
          height={40}
        />
      </button>
    </div>
  )
}

