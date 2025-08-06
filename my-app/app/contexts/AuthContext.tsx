"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const authStatus = localStorage.getItem("isLoggedIn")
    if (authStatus === "true") {
      setIsLoggedIn(true)
      if (pathname === "/login") {
        router.push("/dashboard")
      }
    } else if (pathname !== "/login") {
      router.push("/login")
    }
  }, [pathname, router])

  const login = () => {
    setIsLoggedIn(true)
    localStorage.setItem("isLoggedIn", "true")
    router.push("/dashboard")
  }

  const logout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

