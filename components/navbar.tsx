/**
 * Navbar Component
 * 
 * Provides navigation for the application.
 * Includes links to main pages and user authentication status.
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/alerts",
      label: "Alerts",
      active: pathname === "/alerts",
    },
    {
      href: "/subscribe",
      label: "Subscribe",
      active: pathname === "/subscribe",
    },
  ]

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                route.active
                  ? "text-black dark:text-white"
                  : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {session ? (
            <Button variant="outline" asChild>
              <Link href="/api/auth/signout">Sign Out</Link>
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
} 