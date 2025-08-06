import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Track your personal finances with ease",
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rupees-symbol-png-27189-j7SmeXVWr2TamHYJW0r0bzTL6j8L80.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rupees-symbol-png-27189-j7SmeXVWr2TamHYJW0r0bzTL6j8L80.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rupees-symbol-png-27189-j7SmeXVWr2TamHYJW0r0bzTL6j8L80.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rupees-symbol-png-27189-j7SmeXVWr2TamHYJW0r0bzTL6j8L80.png",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Primary favicon */}
        <link
          rel="icon"
          type="image/png"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rupees-symbol-png-27189-j7SmeXVWr2TamHYJW0r0bzTL6j8L80.png"
        />

        {/* Apple Touch Icon */}
        <link
          rel="apple-touch-icon"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rupees-symbol-png-27189-j7SmeXVWr2TamHYJW0r0bzTL6j8L80.png"
        />

        {/* Microsoft Tile */}
        <meta
          name="msapplication-TileImage"
          content="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rupees-symbol-png-27189-j7SmeXVWr2TamHYJW0r0bzTL6j8L80.png"
        />
        <meta name="msapplication-TileColor" content="#FFD700" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}