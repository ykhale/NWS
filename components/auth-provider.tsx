/**
 * Auth Provider Component
 * 
 * Provides authentication context for the application.
 * Uses NextAuth.js for authentication.
 */

"use client"

import { SessionProvider } from "next-auth/react"
import { type ReactNode } from "react"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>
} 