"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/button"
import { LogOut, Menu, X, CreditCard } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Update the navLinks array to include the balance link next to expenses
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/expenses", label: "Expenses" },
    { href: "/balance", label: "Check Balance", icon: <CreditCard className="h-4 w-4 mr-1" /> },
    { href: "/reports", label: "Reports" },
    { href: "/contact", label: "Contact" },
  ]

  if (!user && pathname !== "/login" && pathname !== "/register") {
    return null
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">Finance</span>
              <span className="text-2xl font-bold ml-1">Tracker</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
                <Button variant="ghost" size="sm" onClick={logout} className="ml-2">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
            {!user && pathname !== "/register" && (
              <Link href="/register">
                <Button variant="outline" size="sm">
                  Register
                </Button>
              </Link>
            )}
            {!user && pathname !== "/login" && (
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-2">
              {user && (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                        pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={toggleMenu}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      toggleMenu()
                      logout()
                    }}
                    className="justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
              {!user && (
                <>
                  {pathname !== "/register" && (
                    <Link href="/register" onClick={toggleMenu}>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Register
                      </Button>
                    </Link>
                  )}
                  {pathname !== "/login" && (
                    <Link href="/login" onClick={toggleMenu}>
                      <Button size="sm" className="w-full justify-start">
                        Login
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

