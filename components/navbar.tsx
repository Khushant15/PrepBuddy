"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/company-questions", label: "Company Q's" },
  { href: "/hr-prep", label: "HR Prep" },
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/resources", label: "Resources" },
  { href: "/jobs", label: "Jobs" },
  { href: "/ai-interview", label: "AI Interview" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser)
    return () => unsub()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur">

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-8">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
              PB
            </div>

            <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PrepBuddy
            </span>
          </Link>

          {/* DESKTOP NAV LINKS (ONLY IF LOGGED IN) */}
          {user && (
            <div className="hidden lg:flex gap-6 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground/70 hover:text-foreground transition font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {user ? (
            <>
              <span className="hidden sm:block text-sm text-foreground/70">
                Welcome, {user.displayName || user.email}
              </span>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-xs border-primary/30 hover:bg-red-500/10"
              >
                <LogOut size={14} className="mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>

              <Link href="/signup">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>

      </div>

      {/* MOBILE NAV LINKS */}
      {isOpen && user && (
        <div className="lg:hidden border-t border-border/30 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm text-foreground/80"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

    </nav>
  )
}