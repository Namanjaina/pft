"use client"

import type React from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Phone, Loader2 } from "lucide-react"

export default function Footer() {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const pathname = usePathname()

  // Check if we're on the contact page
  const isContactPage = pathname === "/contact"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Show immediate feedback that the form is being submitted
    toast({
      title: "Sending message...",
      description: "Please wait while we process your request.",
    })

    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("message", message)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you as soon as possible.",
        })

        // Reset form
        setName("")
        setEmail("")
        setMessage("")
      } else {
        throw new Error(data.message || "Failed to send message. Please try again.")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-12 pb-6">
      <div className="container mx-auto px-4">
        {!isContactPage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Have questions or feedback? We'd love to hear from you!
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600 dark:text-gray-400">financetracker098@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600 dark:text-gray-400">+91 6261075631</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </div>
          </div>
        )}

        <div className={`${!isContactPage ? "border-t border-gray-200 dark:border-gray-700 pt-6" : ""} text-center`}>
          <p className="text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Finance Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}