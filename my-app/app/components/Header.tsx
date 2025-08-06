"use client"

import Link from "next/link"
import Logo from "./logo"
import { useAuth } from "../contexts/AuthContext"
import { CreditCard } from "lucide-react"

export default function Header() {
  const { isLoggedIn, logout } = useAuth()

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact-section")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (!isLoggedIn) return null

  return (
    <header className="bg-gray-900 shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Logo />
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/dashboard" className="text-white hover:text-green-400 transition-colors font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link href="/history" className="text-white hover:text-green-400 transition-colors font-medium">
                History
              </Link>
            </li>
            <li>
              <Link
                href="/balance"
                className="text-white hover:text-green-400 transition-colors font-medium flex items-center"
              >
                <CreditCard className="mr-1 h-4 w-4" />
                Check Balance
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-white hover:text-green-400 transition-colors font-medium">
                Contact Us
              </Link>
            </li>
            <li>
              <button onClick={logout} className="text-white hover:text-red-400 transition-colors font-medium">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

